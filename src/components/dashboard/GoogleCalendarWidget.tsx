import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, RefreshCw, Unlink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

export function GoogleCalendarWidget() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke("google-calendar", {
        body: {},
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Handle the query parameter approach
      const { data, error } = await fetch(
        `https://agflprqqvsndkwlpscvt.supabase.co/functions/v1/google-calendar?action=events`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(res => res.json().then(data => ({ data, error: null })))
        .catch(error => ({ data: null, error }));

      if (data?.needsAuth) {
        setNeedsAuth(true);
        setEvents([]);
      } else if (data?.events) {
        setEvents(data.events);
        setNeedsAuth(false);
      } else if (data?.error) {
        console.error("Calendar error:", data.error);
        if (data.error === "Not connected") {
          setNeedsAuth(true);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleConnect = async () => {
    if (!user) return;
    
    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://agflprqqvsndkwlpscvt.supabase.co/functions/v1/google-calendar?action=auth-url`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.authUrl) {
        // Open in new window for OAuth flow
        const popup = window.open(data.authUrl, "google-auth", "width=500,height=600");
        
        // Poll for completion
        const checkPopup = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkPopup);
            setConnecting(false);
            fetchEvents();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error connecting:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to Google Calendar",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(
        `https://agflprqqvsndkwlpscvt.supabase.co/functions/v1/google-calendar?action=disconnect`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEvents([]);
      setNeedsAuth(true);
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const formatEventDate = (event: CalendarEvent) => {
    const dateStr = event.start.dateTime || event.start.date;
    if (!dateStr) return "";
    
    const date = parseISO(dateStr);
    
    if (isToday(date)) {
      return event.start.dateTime 
        ? `Today at ${format(date, "h:mm a")}`
        : "Today (All day)";
    }
    if (isTomorrow(date)) {
      return event.start.dateTime 
        ? `Tomorrow at ${format(date, "h:mm a")}`
        : "Tomorrow (All day)";
    }
    if (isThisWeek(date)) {
      return event.start.dateTime 
        ? format(date, "EEEE 'at' h:mm a")
        : format(date, "EEEE") + " (All day)";
    }
    return event.start.dateTime 
      ? format(date, "MMM d 'at' h:mm a")
      : format(date, "MMM d") + " (All day)";
  };

  const getEventColor = (event: CalendarEvent) => {
    const dateStr = event.start.dateTime || event.start.date;
    if (!dateStr) return "bg-muted";
    
    const date = parseISO(dateStr);
    if (isToday(date)) return "bg-primary/20 border-primary";
    if (isTomorrow(date)) return "bg-warning/20 border-warning";
    return "bg-muted border-border";
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border min-h-[400px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">Calendar</h3>
        <div className="flex items-center justify-center h-[300px]">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (needsAuth) {
    return (
      <Card className="p-6 bg-card border-border min-h-[400px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">Calendar</h3>
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <Calendar className="w-12 h-12 mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">Connect your Google Calendar to see your events</p>
          <Button onClick={handleConnect} disabled={connecting}>
            {connecting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Connect Google Calendar
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Calendar</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={fetchEvents} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDisconnect} title="Disconnect">
            <Unlink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <Calendar className="w-12 h-12 mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {events.slice(0, 10).map((event) => (
            <a
              key={event.id}
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg border transition-colors hover:bg-accent/50 ${getEventColor(event)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{event.summary}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatEventDate(event)}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
