import { getServerClient } from '@/lib/supabase-client';
import Title from './Title';
import WordList from './WordList';
import CreateWord from './CreateWord';

export default async function Home({ params }: { params: { url: string; lang: string } }) {
  const { url, lang } = params;
  const supabase = getServerClient();

  // Get vocabulary document
  const { data: docData, error: docError } = await supabase
    .from('vocabulary_docs')
    .select('*')
    .eq('url', url)
    .eq('lang', lang)
    .single();

  if (docError) throw docError;

  // Get vocabulary words
  const { data: words, error: wordsError } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('doc_id', docData.id)
    .order('created_at', { ascending: true });

  if (wordsError) throw wordsError;

  return (
    <div className="ml-4">
      <Title id={docData.id} title={docData.title} />
      <WordList words={words} />
      <CreateWord lang={lang} url={url} docId={docData.id} />
    </div>
  );
}
