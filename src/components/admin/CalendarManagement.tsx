
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, PlusCircle, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'promo' | 'content' | 'launch' | 'other';
  status: 'planned' | 'active' | 'completed';
}

const CalendarManagement = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('calendar_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      // Exemples d'événements par défaut
      const defaultEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Promotion Été',
          description: 'Bannière de promotion pour la collection été',
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          type: 'promo',
          status: 'planned'
        },
        {
          id: '2',
          title: 'Nouveau produit T-shirt',
          description: 'Lancement de la nouvelle gamme de t-shirts bio',
          startDate: '2024-06-15',
          endDate: '2024-06-15',
          type: 'launch',
          status: 'planned'
        }
      ];
      setEvents(defaultEvents);
    }
  };

  const saveEvents = (newEvents: CalendarEvent[]) => {
    localStorage.setItem('calendar_events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const createNewEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      type: 'other',
      status: 'planned'
    };
    setEditingEvent(newEvent);
    setIsModalOpen(true);
  };

  const editEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const saveEvent = () => {
    if (!editingEvent) return;

    if (!editingEvent.title.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le titre de l'événement est obligatoire."
      });
      return;
    }

    let updatedEvents;
    if (events.find(e => e.id === editingEvent.id)) {
      updatedEvents = events.map(e => e.id === editingEvent.id ? editingEvent : e);
    } else {
      updatedEvents = [...events, editingEvent];
    }

    saveEvents(updatedEvents);
    setIsModalOpen(false);
    setEditingEvent(null);

    toast({
      title: "Événement sauvegardé",
      description: "L'événement a été ajouté au calendrier éditorial."
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    saveEvents(updatedEvents);
    
    toast({
      title: "Événement supprimé",
      description: "L'événement a été retiré du calendrier."
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'promo': return 'bg-orange-100 text-orange-800';
      case 'content': return 'bg-blue-100 text-blue-800';
      case 'launch': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendrier Éditorial
            </CardTitle>
            <Button 
              onClick={createNewEvent}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement planifié</p>
                <p className="text-sm">Créez votre premier événement pour commencer</p>
              </div>
            ) : (
              events
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-gray-600">{event.description}</p>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          {event.startDate === event.endDate ? (
                            <span>📅 {formatDate(event.startDate)}</span>
                          ) : (
                            <span>📅 Du {formatDate(event.startDate)} au {formatDate(event.endDate)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {events.find(e => e.id === editingEvent.id) ? "Modifier" : "Créer"} un événement
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre*</label>
                <Input
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    title: e.target.value 
                  })}
                  placeholder="Nom de l'événement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    description: e.target.value 
                  })}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <Input
                    type="date"
                    value={editingEvent.startDate}
                    onChange={(e) => setEditingEvent({ 
                      ...editingEvent, 
                      startDate: e.target.value 
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <Input
                    type="date"
                    value={editingEvent.endDate}
                    onChange={(e) => setEditingEvent({ 
                      ...editingEvent, 
                      endDate: e.target.value 
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={editingEvent.type}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    type: e.target.value as CalendarEvent['type']
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="promo">Promotion</option>
                  <option value="content">Contenu</option>
                  <option value="launch">Lancement</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={editingEvent.status}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    status: e.target.value as CalendarEvent['status']
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="planned">Planifié</option>
                  <option value="active">Actif</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={saveEvent}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManagement;
