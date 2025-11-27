import * as fs from 'fs';

export function generateHtmlReport(results, modelNames, outputPath) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LLM Classifier Evaluation Results</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; position: sticky; top: 0; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .correct { background-color: #d4edda; color: #155724; }
    .incorrect { background-color: #f8d7da; color: #721c24; }
    .message-col { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .message-col:hover { white-space: normal; overflow: visible; }
    tr:hover { outline: 1px solid #999; }
    .col-hover { box-shadow: inset 0 0 0 9999px rgba(0,0,0,0.05); }
  </style>
</head>
<body>
  <h1>Evaluation Results</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Message</th>
        <th>Expected</th>
        ${modelNames.map(name => `<th>${name}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${results.map(row => {
        const expected = row.expected_category;
        return `
      <tr>
        <td>${row.id}</td>
        <td class="message-col" title="${row.message_text.replace(/"/g, '&quot;')}">${row.message_text}</td>
        <td>${expected}</td>
        ${modelNames.map(name => {
          const prediction = row[`${name}_prediction`];
          const isCorrect = prediction === expected;
          const className = isCorrect ? 'correct' : 'incorrect';
          const tooltip = `Model: ${name}&#10;Message: ${row.message_text.replace(/"/g, '&quot;')}&#10;Expected: ${expected}`;
          return `<td class="${className}" title="${tooltip}">${prediction}</td>`;
        }).join('')}
      </tr>`;
      }).join('')}
  </table>
  <script>
    const table = document.querySelector('table');
    table.addEventListener('mouseover', (e) => {
      const cell = e.target.closest('td, th');
      if (!cell) return;
      const index = cell.cellIndex + 1;
      document.querySelectorAll(\`td:nth-child(\${index}), th:nth-child(\${index})\`).forEach(el => el.classList.add('col-hover'));
    });
    table.addEventListener('mouseout', (e) => {
      const cell = e.target.closest('td, th');
      if (!cell) return;
      const index = cell.cellIndex + 1;
      document.querySelectorAll(\`td:nth-child(\${index}), th:nth-child(\${index})\`).forEach(el => el.classList.remove('col-hover'));
    });
  </script>
</body>le>
</body>
</html>
  `;

  fs.writeFileSync(outputPath, htmlContent);
  console.log(`  📊 HTML report saved to ${outputPath}`);
}
