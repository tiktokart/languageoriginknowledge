
import React from "react";

const FEATURE_CONTEXT: {
  category: string;
  definition: string;
  valueExamples?: { value: string; explanation: string }[];
}[] = [
  {
    category: "Phonology",
    definition:
      "Phonology is the study of the sound systems and patterns in languages, including the inventory and structure of speech sounds.",
    valueExamples: [
      { value: "Small", explanation: "A small set of vowel or consonant sounds (5 or fewer vowels)." },
      { value: "Large", explanation: "More than 7 vowel sounds or complex consonant inventories." },
      { value: "Simple", explanation: "Very basic, limited variety in the set of sounds." },
    ],
  },
  {
    category: "Word Order",
    definition:
      "Word Order examines the typical arrangement of subjects, verbs, and objects in sentences.",
    valueExamples: [
      { value: "SVO", explanation: "Subject-Verb-Object order (e.g., English: 'She sees the dog')." },
      { value: "SOV", explanation: "Subject-Object-Verb order (e.g., Japanese: 'She the dog sees')." },
      { value: "VSO", explanation: "Verb-Subject-Object (e.g., Classical Arabic: 'Sees she the dog')." },
    ],
  },
  {
    category: "Morphology",
    definition:
      "Morphology studies how words are formed and structured, and how they change for grammatical reasons.",
    valueExamples: [
      { value: "Isolating", explanation: "Words tend to be single morphemes; little to no change for grammar." },
      { value: "Agglutinating", explanation: "Words formed by stringing together morphemes, each with a distinct function." },
      { value: "Fusional", explanation: "Morphemes may express several grammatical features at once." },
    ],
  },
  {
    category: "Verbal Categories",
    definition:
      "Verbal Categories focus on grammatical features of verbs, such as tense, aspect, and mood.",
    valueExamples: [
      { value: "Tense", explanation: "Indicates time (past, present, future)." },
      { value: "Aspect", explanation: "Shows if action is completed or ongoing." },
      { value: "Mood", explanation: "Expresses attitude (e.g., necessity, possibility)." },
    ],
  },
  {
    category: "Simple Clauses",
    definition:
      "Simple Clauses analyze how basic sentences are structured, including negation, question formation, and argument expression.",
    valueExamples: [
      { value: "Negative", explanation: "How negation ('not') is expressed in the language." },
      { value: "Question Particle", explanation: "Use of particles to show questions." },
    ],
  },
  {
    category: "Nominal Categories",
    definition:
      "Nominal Categories concern properties expressed within noun phrases, like gender, case, and number.",
    valueExamples: [
      { value: "Gender", explanation: "Whether nouns are categorized as masculine, feminine, etc." },
      { value: "Case", explanation: "Marking relationships (subject, object, etc.) with inflections." },
      { value: "Plural", explanation: "Whether and how plurality (more than one) is shown." },
    ],
  },
];

const FeatureContextBox = () => (
  <section className="mb-6 rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm">
    <h2 className="text-lg font-bold text-blue-900 mb-3">Family Tree Analysis: Category & Value Guide</h2>
    <p className="text-slate-700 text-sm mb-4">
      This visualization groups languages by major structural categories, each representing a key linguistic property.
      Definitions below clarify what these categories mean, and example values provide context for interpreting the graphs.
    </p>
    <div className="space-y-4">
      {FEATURE_CONTEXT.map((cat) => (
        <div key={cat.category}>
          <div className="font-semibold text-blue-700">{cat.category}</div>
          <div className="text-xs text-slate-700 mb-1">{cat.definition}</div>
          {cat.valueExamples && (
            <ul className="ml-5 list-disc text-xs text-slate-600">
              {cat.valueExamples.map((v) => (
                <li key={v.value}>
                  <span className="font-semibold text-blue-700">{v.value}:</span>{" "}
                  <span>{v.explanation}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default FeatureContextBox;
