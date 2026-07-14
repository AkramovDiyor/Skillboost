
export const baseCompanies = [
  { name: 'Т-Банк' },
  { name: 'Ozon' },
  { name: 'Сбер' },
  { name: 'Яндекс' },
  { name: 'Авито' },
  { name: 'VK' },
  { name: 'Альфа-Банк' },
  { name: 'Самокат' },
  { name: 'Островок' },
  { name: 'Домклик' },
  { name: 'X5 Group' },
  { name: 'Додо' },
  { name: 'T1' },
  { name: 'Wildberries' },
  { name: '2ГИС' },
  { name: 'Нетология' },
  { name: 'Спортмастер' },
  { name: 'Google' },
  { name: 'Amazon' },
  { name: 'Microsoft' },
  { name: 'Meta' },
  { name: 'Uber' },
  { name: 'Apple' },
  { name: 'Airbnb' },
  { name: 'Магнит' },
  { name: 'Yadro' },
  { name: 'IT_One' },
  { name: 'M-Холдинг' },
  { name: 'ЦРТ' },
  { name: 'EdgeЦентр' },
  { name: 'Ваш Инвестор' },
  { name: 'Fingular' },
  { name: 'BalancePlatform' },
  { name: 'Код открытия' },
  { name: 'ТехЛАБ' },
  { name: 'Актив' },
  { name: 'Idea Platform' },
  { name: 'Nvidia' },
  { name: 'Sportradar' },
];



export const allCompanies = baseCompanies.map(company => ({
  ...company,
  count: typeof tasksData !== 'undefined' 
    ? tasksData.filter(task => task.companies.includes(company.name)).length 
    : 0
}));