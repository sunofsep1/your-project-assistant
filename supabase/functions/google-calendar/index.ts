import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User authenticated:", user.id);

    if (action === "auth-url") {
      // Generate OAuth URL for Google Calendar
      // Use the proper edge function URL format
      const redirectUri = `https://agflprqqvsndkwlpscvt.supabase.co/functions/v1/google-calendar?action=callback`;
      const scope = encodeURIComponent("https://www.googleapis.com/auth/calendar.readonly");
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent` +
        `&state=${user.id}`;

      console.log("Generated auth URL for user:", user.id);
      console.log("Redirect URI:", redirectUri);

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "callback") {
      // Handle OAuth callback
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (!code) {
        return new Response(JSON.stringify({ error: "No authorization code" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const redirectUri = `https://agflprqqvsndkwlpscvt.supabase.co/functions/v1/google-calendar?action=callback`;

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        console.error("Token exchange error:", tokens);
        return new Response(JSON.stringify({ error: tokens.error_description || tokens.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Token exchange successful for user:", state || user.id);

      // Store tokens in user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        state || user.id,
        {
          user_metadata: {
            google_access_token: tokens.access_token,
            google_refresh_token: tokens.refresh_token,
            google_token_expiry: Date.now() + (tokens.expires_in * 1000),
          },
        }
      );

      if (updateError) {
        console.error("Error storing tokens:", updateError);
        return new Response(JSON.stringify({ error: "Failed to store tokens" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "events") {
      // Fetch calendar events
      const { data: userData, error: fetchError } = await supabase.auth.admin.getUserById(user.id);

      if (fetchError || !userData.user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let accessToken = userData.user.user_metadata?.google_access_token;
      const refreshToken = userData.user.user_metadata?.google_refresh_token;
      const tokenExpiry = userData.user.user_metadata?.google_token_expiry;

      if (!accessToken || !refreshToken) {
        return new Response(JSON.stringify({ error: "Not connected", needsAuth: true }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Refresh token if expired
      if (tokenExpiry && Date.now() > tokenExpiry - 60000) {
        console.log("Refreshing token for user:", user.id);
        
        const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID!,
            client_secret: GOOGLE_CLIENT_SECRET!,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
          
          await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...userData.user.user_metadata,
              google_access_token: refreshData.access_token,
              google_token_expiry: Date.now() + (refreshData.expires_in * 1000),
            },
          });
        }
      }

      // Fetch events from Google Calendar
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ahead

      const eventsResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${encodeURIComponent(timeMin)}&` +
        `timeMax=${encodeURIComponent(timeMax)}&` +
        `maxResults=50&` +
        `singleEvents=true&` +
        `orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const eventsData = await eventsResponse.json();

      if (eventsData.error) {
        console.error("Google Calendar API error:", eventsData.error);
        
        if (eventsData.error.code === 401) {
          return new Response(JSON.stringify({ error: "Token expired", needsAuth: true }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify({ error: eventsData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Fetched ${eventsData.items?.length || 0} events for user:`, user.id);

      return new Response(JSON.stringify({ events: eventsData.items || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "disconnect") {
      // Remove Google tokens from user metadata
      const { data: userData } = await supabase.auth.admin.getUserById(user.id);
      
      if (userData.user) {
        const { google_access_token, google_refresh_token, google_token_expiry, ...restMetadata } = userData.user.user_metadata || {};
        
        await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: restMetadata,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Edge function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
