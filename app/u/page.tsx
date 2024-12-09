import { headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateLanguage from './CreateLang';
import ProfileDrop from '@utils/ProfileDrop';
import Block from '@utils/Block';
import LangIcon from '@utils/LangIcon';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Home() {
  if (headers().get('x-prerender-revalidate')) {
    return null;
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/login');
    }

    const { data: languages, error: langError } = await supabase
      .from('language')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (langError) {
      throw langError;
    }

    const langlist = languages?.map((item) => item.lang) || [];

    return (
      <>
        <div className="p-5 bg-base-100 flex flex-col items-end">
          <ProfileDrop />
        </div>
        <div className="min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold py-10">Language Notebooks</h1>
            <div className="flex flex-col gap-5 p-10 items-center">
              {languages?.map(item => (
                <div key={item.id} className="flex flex-col gap-10 items-center">
                  <Block link={`/u/${item.lang}`}>
                    <div className="flex flex-row gap-5 items-center">
                      <LangIcon lang={item.lang} size={32}/>
                      {item.name}
                    </div>
                  </Block>
                </div>
              ))}
              <CreateLanguage created={langlist}/>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    redirect('/login');
  }
}