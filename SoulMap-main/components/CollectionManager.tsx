'use client';

import { useState, useEffect } from 'react';
import { Folder, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { type Collection } from '@/lib/types';
import { toast } from 'sonner';

interface CollectionManagerProps {
  onSelectCollection: (collectionId: string | null) => void;
  selectedCollection: string | null;
}

export function CollectionManager({ onSelectCollection, selectedCollection }: CollectionManagerProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCollections(data as Collection[]);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    const { error } = await supabase
      .from('collections')
      .insert({ name: newCollectionName.trim() });

    if (error) {
      toast.error('Failed to create collection');
    } else {
      toast.success('Collection created');
      setNewCollectionName('');
      setIsCreating(false);
      fetchCollections();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Collections</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectCollection(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all whitespace-nowrap ${
            selectedCollection === null
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <Folder className="w-4 h-4" />
          All Moments
        </button>

        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onSelectCollection(collection.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all whitespace-nowrap ${
              selectedCollection === collection.id
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <Folder className="w-4 h-4" />
            {collection.name}
          </button>
        ))}

        {isCreating ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCollection();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewCollectionName('');
                }
              }}
              placeholder="Collection name"
              autoFocus
              className="w-40 px-3 py-2 rounded-md bg-input border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
            <button
              onClick={handleCreateCollection}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewCollectionName('');
              }}
              className="p-2 rounded-md bg-secondary border border-border text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        )}
      </div>
    </div>
  );
}
