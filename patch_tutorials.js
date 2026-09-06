import fs from 'fs';

let content = fs.readFileSync('web-app/src/App.jsx', 'utf8');

const tutsPageRegex = /const TutorialsPage = \(\) => \([\s\S]*?\n\);/m;

const newTutsPage = `const TutorialsPage = () => {
  return (
    <div className="p-4 space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Learning & Tutorials</h1>
        <Badge variant="neutral">YouTube API v3</Badge>
      </div>
      <Card className="p-12 text-center text-gray-500">
        <p>No video tutorials available yet. Connect YouTube API in settings to load live video feeds.</p>
      </Card>
    </div>
  );
};`;

content = content.replace(tutsPageRegex, newTutsPage);
fs.writeFileSync('web-app/src/App.jsx', content);
