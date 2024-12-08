import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateLanguage from './CreateLang';
import ProfileDrop from '@utils/ProfileDrop';
import Block from '@utils/Block';
import LangIcon from '@utils/LangIcon';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('U page session check:', { hasSession: !!session, error: sessionError });

    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      console.log('No session in /u page, redirecting to login');
      redirect('/login');
    }

    // Get languages for the current user
    const { data: languages, error: langError } = await supabase
      .from('language')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    console.log('Languages query:', { 
      userId: session.user.id,
      hasLanguages: !!languages,
      languageCount: languages?.length,
      error: langError 
    });

    if (langError) {
      console.error('Language query error:', langError);
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
    console.error('Error in /u page:', error);
    redirect('/login');
  }
}
