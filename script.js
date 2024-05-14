document.getElementById('startSetup').addEventListener('click', setupPlayers);
document.getElementById('startRace').addEventListener('click', startRace);
document.getElementById('resetGame').addEventListener('click', resetGame);

let rankings = [];
let turtleIntervals = [];

function setupPlayers() {
  const numPlayers = document.getElementById('numPlayers').value;
  const playersDiv = document.getElementById('players');
  playersDiv.innerHTML = '';
  rankings = []; // Reset rankings

  for (let i = 0; i < numPlayers; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Player ${i + 1} Name`;
    input.id = `player${i + 1}`;
    playersDiv.appendChild(input);
  }

  document.getElementById('startRace').disabled = false;
}

function startRace() {
  const numPlayers = document.getElementById('numPlayers').value;
  const raceTrack = document.getElementById('raceTrack');
  const namesDiv = document.getElementById('names');
  raceTrack.innerHTML = '';
  namesDiv.innerHTML = '';
  rankings = []; // Reset rankings

  for (let i = 0; i < numPlayers; i++) {
    const name =
      document.getElementById(`player${i + 1}`).value || `Player ${i + 1}`;
    const displayName = truncateName(name);

    // 이름 표시
    const nameDiv = document.createElement('div');
    nameDiv.className = 'player-name';
    nameDiv.innerText = name;
    namesDiv.appendChild(nameDiv);

    const turtle = document.createElement('div');
    turtle.className = `turtle color-${i % 10}`;
    turtle.id = `turtle${i + 1}`;
    turtle.title = name; // 이름을 툴팁으로 표시

    raceTrack.appendChild(turtle);
    animateTurtle(turtle, numPlayers);
  }
}

function truncateName(name) {
  // 한글과 영어 구분하여 최대 두 글자 반환
  if (/^[A-Za-z]+$/.test(name)) {
    // 영어인 경우 첫 두 글자 반환
    return name.slice(0, 2);
  } else {
    // 한글인 경우 첫 글자 반환
    return name.slice(0, 1);
  }
}

function animateTurtle(turtle, totalPlayers) {
  let speed = Math.random() * 5; // 초기 속도 설정

  const interval = setInterval(() => {
    const currentLeft = parseInt(turtle.style.left || 0);
    turtle.style.left = `${currentLeft + speed}px`;

    if (currentLeft + speed >= raceTrack.clientWidth - 64) {
      clearInterval(interval);
      turtleIntervals = turtleIntervals.filter((t) => t !== interval);

      // 기록된 순위에 추가
      rankings.push(turtle.title);

      // 모든 거북이가 결승선을 통과하면 순위 표시
      if (rankings.length == totalPlayers) {
        alert(
          `Race results:\n${rankings
            .map((name, index) => `${index + 1}. ${name}`)
            .join('\n')}`
        );
      }
    }
  }, 100);

  // 일정 간격으로 속도 변경
  const speedChangeInterval = setInterval(() => {
    speed = Math.random() * 5;
  }, 500); // 1초마다 속도 변경

  turtleIntervals.push(interval, speedChangeInterval);

  // 경주가 끝나면 속도 변경 중지
  setTimeout(
    () => clearInterval(speedChangeInterval),
    (raceTrack.clientWidth / speed) * 100
  );
}

function resetGame() {
  // Clear all intervals
  turtleIntervals.forEach(clearInterval);
  turtleIntervals = [];

  // Reset the interface
  document.getElementById('players').innerHTML = '';
  document.getElementById('raceTrack').innerHTML = '';
  document.getElementById('names').innerHTML = '';
  document.getElementById('startRace').disabled = true;
  document.getElementById('numPlayers').value = 1;
  rankings = [];
}
