export const TaskTags = ({ 
  difficulty, 
  companies,       
  extraCompanies,   
  solvedPercent,    
  languages,       
}) => {

  const tags = [

    { 
      label: difficulty, 
      color: difficulty === 'Сложная' ? 'red' : difficulty === 'Средняя' ? 'orange' : 'green' 
    },

    ...companies.map(company => ({ label: company, color: 'gray' })),

    ...(extraCompanies > 0 ? [{ label: `+${extraCompanies}`, color: 'gray' }] : []),

    { label: `${solvedPercent}%`, color: 'gray' },

    ...languages.map(lang => ({ label: lang, color: 'yellow' })),
  ];

  return (
    <div className="flex items-center space-x-2 flex-wrap gap-y-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-2 py-0.5 text-xs rounded-full border font-medium transition-colors"
          style={{
            backgroundColor: `var(--tag-${tag.color}-bg)`,
            color: `var(--tag-${tag.color}-text)`,
            borderColor: `var(--tag-${tag.color}-border)`,
          }}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
};