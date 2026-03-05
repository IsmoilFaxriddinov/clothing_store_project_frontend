import uz from "./uz.json";
import ru from "./ru.json";
import en from "./en.json";

export const languages = { uz, ru, en };
export type Lang = "uz" | "ru" | "en";

export const getDictionary = (lang: Lang) => languages[lang] || languages.uz;