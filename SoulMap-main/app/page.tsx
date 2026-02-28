'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { HeroSection } from '@/components/HeroSection';
import { MomentForm } from '@/components/MomentForm';
import { TimelineView } from '@/components/TimelineView';
import { EmptyState } from '@/components/EmptyState';
import { MomentModal } from '@/components/MomentModal';
import { CollectionManager } from '@/components/CollectionManager';
import { StatsBar } from '@/components/StatsBar';
import { supabase } from '@/lib/supabase';
import { type Moment, type MomentType, type CinematicStyle } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [filteredMoments, setFilteredMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionsCount, setCollectionsCount] = useState(0);

  const fetchMoments = useCallback(async () => {
    const { data, error } = await supabase
      .from('moments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load moments');
      console.error('Fetch error:', error);
    } else {
      setMoments((data as Moment[]) ?? []);
    }

    const { count } = await supabase
      .from('collections')
      .select('*', { count: 'exact', head: true });

    setCollectionsCount(count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  useEffect(() => {
    const filterMoments = async () => {
      if (selectedCollection === null) {
        setFilteredMoments(moments);
      } else {
        const { data, error } = await supabase
          .from('moment_collections')
          .select('moment_id')
          .eq('collection_id', selectedCollection);

        if (!error && data) {
          const momentIds = data.map((mc) => mc.moment_id);
          setFilteredMoments(moments.filter((m) => momentIds.includes(m.id)));
        }
      }
    };

    filterMoments();
  }, [selectedCollection, moments]);

  const handleGenerated = async (result: {
    description: string;
    momentType: MomentType;
    cinematicStyle: CinematicStyle;
    imageUrl: string;
  }) => {
    const { data, error } = await supabase
      .from('moments')
      .insert({
        user_description: result.description,
        moment_type: result.momentType,
        cinematic_style: result.cinematicStyle,
        image_url: result.imageUrl,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to save moment');
      console.error('Save error:', error);
      return;
    }

    setMoments((prev) => [data as Moment, ...prev]);
    toast.success('Moment created successfully');

    setTimeout(() => {
      const timeline = document.getElementById('timeline');
      timeline?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleDelete = async (momentId: string) => {
    try {
      const { error } = await supabase
        .from('moments')
        .delete()
        .eq('id', momentId);

      if (error) {
        toast.error('Failed to delete moment');
        console.error('Delete error:', error);
        throw error;
      }

      setMoments((prev) => prev.filter((m) => m.id !== momentId));
      setSelectedMoment(null);
      toast.success('Moment deleted');
    } catch (error) {
      throw error;
    }
  };

  return (
    <main className="min-h-screen">
      <HeroSection />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <MomentForm onGenerated={handleGenerated} />
      </div>

      <div id="timeline" className="pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading moments...</p>
          </div>
        ) : moments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <StatsBar moments={moments} collectionsCount={collectionsCount} />
            <CollectionManager
              onSelectCollection={setSelectedCollection}
              selectedCollection={selectedCollection}
            />
            <TimelineView moments={filteredMoments} onSelectMoment={setSelectedMoment} />
          </>
        )}
      </div>

      <MomentModal moment={selectedMoment} onClose={() => setSelectedMoment(null)} onDelete={handleDelete} />
    </main>
  );
}
