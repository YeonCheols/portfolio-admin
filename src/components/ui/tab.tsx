import { type TabProps } from '@/types/tabs';

function Tabs({ tabs, activeTab, onTabChange }: TabProps) {
  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map(tab => (
            <li key={tab.id} className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-black dark:text-white border-black dark:border-white hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    : 'dark:border-transparent text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                }`}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === tab.id ? 'block' : 'hidden'}`}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
}

Tabs.displayName = 'Tabs';

export { Tabs };
