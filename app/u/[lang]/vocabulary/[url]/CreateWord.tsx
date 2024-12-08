'use client';
import { getClient } from '@/lib/supabase-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateWord({
  lang,
  url,
  docId
}: {
  lang: string;
  url: string;
  docId: string;
}) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();
  const supabase = getClient();

  const create = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('vocabulary')
        .insert({
          word,
          translation,
          notes,
          url,
          user_id: user.id,
          doc_id: docId
        });

      if (insertError) throw insertError;

      // Reset form
      setWord('');
      setTranslation('');
      setNotes('');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating word:', error.message);
    }
  };

  return (
    <div className="dropdown dropdown-right">
      <label tabIndex={0}>
        <button title="Create word" className="btn btn-primary capitalize m-6">
          add
        </button>
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card card-compact w-64 p-2 shadow bg-primary text-primary-content"
      >
        <div className="card-body">
          <h3 className="card-title">Add word</h3>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word"
            className="input max-w-xs"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation"
            className="input max-w-xs"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="input max-w-xs"
          />
          <button onClick={create} className="btn">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
