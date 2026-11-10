const canvas = document.querySelector<HTMLCanvasElement>('canvas#game');
if (!canvas) throw new Error('index.html must contain <canvas id="game">');

const context = canvas.getContext('2d');
if (!context) throw new Error('2D canvas context is not supported');

context.fillStyle = '#ffffff';
context.font = '20px sans-serif';
context.textAlign = 'center';
context.fillText('Bubble shooter: see the issues', canvas.width / 2, canvas.height / 2);
