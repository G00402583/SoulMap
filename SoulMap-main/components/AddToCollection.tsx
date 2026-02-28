'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { type Collection } from '@/lib/types';
import { toast } from 'sonner';

interface AddToCollectionProps {
  momentId: string;
}

export function AddToCollection({ momentId }: AddToCollectionProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [momentCollections, setMomentCollections] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
      fetchMomentCollections();
    }
  }, [isOpen, momentId]);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCollections(data as Collection[]);
    }
  };

  const fetchMomentCollections = async () => {
    const { data, error } = await supabase
      .from('moment_collections')
      .select('collection_id')
      .eq('moment_id', momentId);

    if (!error && data) {
      setMomentCollections(data.map((mc) => mc.collection_id));
    }
  };

  const toggleCollection = async (collectionId: string) => {
    const isInCollection = momentCollections.includes(collectionId);

    if (isInCollection) {
      const { error } = await supabase
        .from('moment_collections')
        .delete()
        .eq('moment_id', momentId)
        .eq('collection_id', collectionId);

      if (error) {
        toast.error('Failed to remove from collection');
      } else {
        setMomentCollections((prev) => prev.filter((id) => id !== collectionId));
        toast.success('Removed from collection');
      }
    } else {
      const { error } = await supabase
        .from('moment_collections')
        .insert({ moment_id: momentId, collection_id: collectionId });

      if (error) {
        toast.error('Failed to add to collection');
      } else {
        setMomentCollections((prev) => [...prev, collectionId]);
        toast.success('Added to collection');
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-secondary border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary/80 transition-colors"
      >
        <FolderPlus className="w-4 h-4" />
        Add to Collection
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 professional-card rounded-lg p-2 shadow-lg z-20">
            {collections.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No collections yet
              </p>
            ) : (
              <div className="space-y-1">
                {collections.map((collection) => {
                  const isInCollection = momentCollections.includes(collection.id);
                  return (
                    <button
                      key={collection.id}
                      onClick={() => toggleCollection(collection.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-foreground">{collection.name}</span>
                      {isInCollection && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
