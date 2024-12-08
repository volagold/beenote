'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import LangIcon from "@utils/LangIcon";

const languages = [
  // north america
  "english",
  // northern europe
  "swedish",
  "norwegian",
  "finnish",
  "danish",
  // western europe
  "german",
  "dutch",
  "french",
  // southern europe
  "spanish",
  "portuguese",
  "italian",
  // central & eastern europe
  "czech",
  "slovak",
  "polish",
  "hungarian",
  "slovene",
  "croatian",
  "bosnian",
  "serbian",
  "romanian",
  "bulgarian",
  "albanian",
  "ukrainian", 
  "russian",
  "greek",
  "turkish",
  "georgian",
  // middle east,
  "persian",
  "arabic",
  // asia
  "japanese",
  "korean",
  "chinese",
  "cantonese",
  "hindi",
  "thai",
  "vietnamese",
  "indonesian",
  "malaysian",
];

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function CreateLanguage({ created }: { created: string[] }) {
  const new_list = languages.filter((item) => !created.includes(item));
  const [lang, setLang] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleClick = (item: string) => {
    setLang(item);
  };

  const create = async () => {
    if (lang === "") {
      toast.error("Please select a language");
      return;
    }

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        router.push('/login');
        return;
      }

      // Create language
      const { error: insertError } = await supabase
        .from('language')
        .insert({
          user_id: session.user.id,
          lang: lang,
          name: capitalize(lang)
        });

      if (insertError) throw insertError;

      toast.success("Created successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create language");
      if (error.message?.includes('auth')) {
        router.push('/login');
      }
    }
  };

  return (
    <>
      <label htmlFor="modal-create-lang" className="cursor-pointer">
        <div className="relative">
          <div className="flex flex-row relative items-center justify-center gap-2 box-border w-72 h-20 p-4 border-4 rounded-full border-slate-800 bg-primary z-10 active:translate-x-1 active:translate-y-1">
            <i className="ri-add-line text-xl"></i>
            <span className="text-xl">Create Language</span>
          </div>
        </div>
      </label>

      <input type="checkbox" id="modal-create-lang" className="modal-toggle" />
      <label htmlFor="modal-create-lang" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <p>*This is not an inclusive list of all human languages on earth.</p>
          {new_list.map((item) => (
            <div
              key={item}
              onClick={() => handleClick(item)}
              className={`flex flex-row items-center gap-5 p-2 rounded-md cursor-pointer hover:bg-primary ${
                item === lang ? "bg-primary" : ""
              }`}
            >
              <LangIcon lang={item} size={50} />
              <h3 className="text-lg font-bold text-info">
                {capitalize(item)}
              </h3>
            </div>
          ))}

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="modal-create-lang"
              onClick={create}
              className="modal-action btn btn-primary btn-block justify-center"
            >
              Create
            </label>
            <label
              htmlFor="modal-create-lang"
              className="modal-action btn btn-primary btn-block justify-center"
            >
              Cancel
            </label>
          </div>
        </label>
      </label>
    </>
  );
}
