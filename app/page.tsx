'use client';

import { useEffect, useState } from 'react';

type Event = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  _count?: {
    votes: number;
  };
};

type Agenda = {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  events: Event[];
};

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Record<number, number>>({});
  const [submittingAgendas, setSubmittingAgendas] = useState<Record<number, boolean>>({});
  const [votedEvents, setVotedEvents] = useState<Record<number, number>>({});

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Fetch agendas and events when user is logged in
  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          // Fetch agendas
          const agendasResponse = await fetch('/api/agendas');
          const agendasData = await agendasResponse.json();
          setAgendas(agendasData);

          // Fetch user's voting history
          const votesResponse = await fetch('/api/votes');
          const votesData = await votesResponse.json();
          if (votesData.votes) {
            // Create a map of agendaId -> eventId
            const votedEventsMap: Record<number, number> = {};
            votesData.votes.forEach((vote: { agendaId: number; eventId: number }) => {
              votedEventsMap[vote.agendaId] = vote.eventId;
            });
            setVotedEvents(votedEventsMap);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [username]);

  // Generate a new username
  const handleGenerateUsername = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error('Error generating username:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle radio button change
  const handleEventSelect = (agendaId: number, eventId: number) => {
    setSelectedEvents(prev => ({
      ...prev,
      [agendaId]: eventId
    }));
  };

  // Handle vote submission for individual agenda
  const handleAgendaVoteSubmit = async (agendaId: number) => {
    if (!selectedEvents[agendaId]) {
      alert('Please select an event to vote for');
      return;
    }

    // Find the agenda and selected event to get their names
    const agenda = agendas.find(a => a.id === agendaId);
    const selectedEvent = agenda?.events.find(e => e.id === selectedEvents[agendaId]);
    
    if (!selectedEvent || !agenda) {
      alert('Selected event not found');
      return;
    }

    // Show confirmation dialog with agenda and event names
    const confirmed = confirm(
      `You are going to vote for:\n\nAgenda: "${agenda.name}"\nEvent: "${selectedEvent.name}"\n\nThis action cannot be undone. Do you want to proceed?`
    );

    if (!confirmed) {
      return; // User cancelled
    }

    setSubmittingAgendas(prev => ({ ...prev, [agendaId]: true }));
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvents[agendaId],
          agendaId: agendaId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to submit vote');
        return;
      }

      // Update voted events state
      setVotedEvents(prev => ({
        ...prev,
        [agendaId]: selectedEvents[agendaId]
      }));
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote');
    } finally {
      setSubmittingAgendas(prev => ({ ...prev, [agendaId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Voting App
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 dark:border-zinc-50 border-r-transparent"></div>
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                  Loading...
                </p>
              </div>
            </div>
          ) : username ? (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
                  Welcome!
                </p>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-100 dark:border-blue-900">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    သင့်နံပါတ်
                  </p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 break-all">
                    {username}
                  </p>
                </div>
              </div>

              {/* Voting Form */}
              {agendas.length > 0 ? (
                <div className="space-y-6">
                  {/* Agendas with Events */}
                  {agendas.map((agenda) => {
                    const hasVoted = votedEvents[agenda.id] !== undefined;
                    const votedEventId = votedEvents[agenda.id];

                    return (
                      <div
                        key={agenda.id}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 whitespace-pre-line">
                            {agenda.name}
                          </h2>
                          {agenda.description && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                              {agenda.description}
                            </p>
                          )}
                        </div>

                        {/* Events List */}
                        {agenda.events.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {agenda.events.map((event) => {
                              const isVotedEvent = hasVoted && votedEventId === event.id;
                              const isOtherEvent = hasVoted && votedEventId !== event.id;

                              return (
                                <label
                                  key={event.id}
                                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                                    isVotedEvent
                                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30 cursor-default'
                                      : isOtherEvent
                                      ? 'border-gray-200 bg-gray-100 dark:border-zinc-800 dark:bg-zinc-800/30 opacity-60 cursor-default'
                                      : selectedEvents[agenda.id] === event.id
                                      ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                      : 'border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                  }`}
                                >
                                  {!hasVoted && (
                                    <input
                                      type="radio"
                                      name={`agenda-${agenda.id}`}
                                      value={event.id}
                                      checked={selectedEvents[agenda.id] === event.id}
                                      onChange={() => handleEventSelect(agenda.id, event.id)}
                                      className="mt-1 w-5 h-5 text-zinc-900 dark:text-zinc-50 cursor-pointer"
                                    />
                                  )}
                                  {isVotedEvent && (
                                    <div className="mt-1">
                                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className={`font-medium whitespace-pre-line ${
                                      isVotedEvent
                                        ? 'text-green-900 dark:text-green-100'
                                        : isOtherEvent
                                        ? 'text-gray-500 dark:text-zinc-500'
                                        : 'text-zinc-900 dark:text-zinc-50'
                                    }`}>
                                      {event.name}
                                    </p>
                                    {event.description && (
                                      <p className={`text-sm mt-1 whitespace-pre-line ${
                                        isVotedEvent
                                          ? 'text-green-700 dark:text-green-300'
                                          : isOtherEvent
                                          ? 'text-gray-400 dark:text-zinc-600'
                                          : 'text-zinc-600 dark:text-zinc-400'
                                      }`}>
                                        {event.description}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mb-4">
                            No events available for this agenda
                          </p>
                        )}

                        {/* Submit Button - only show if not voted */}
                        {!hasVoted && (
                          <button
                            type="button"
                            onClick={() => handleAgendaVoteSubmit(agenda.id)}
                            disabled={submittingAgendas[agenda.id] || !selectedEvents[agenda.id]}
                            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl py-3 px-6 font-semibold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                          >
                            {submittingAgendas[agenda.id] ? (
                              <span className="flex items-center justify-center gap-3">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-current border-r-transparent"></span>
                                Submitting...
                              </span>
                            ) : (
                              'Submit Vote'
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No agendas available at the moment
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Getting Started Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                    <svg className="w-8 h-8 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                    Get Started
                  </h2>
                  <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Generate a random username to start participating in votes. Your username will persist across browser tabs.
                  </p>
                </div>
                
                <button
                  onClick={handleGenerateUsername}
                  disabled={generating}
                  className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl py-4 px-6 font-semibold text-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-current border-r-transparent"></span>
                      Generating...
                    </span>
                  ) : (
                    'Generate Username'
                  )}
                </button>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Anonymous Voting
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      Your random username ensures privacy while allowing you to participate in voting events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
