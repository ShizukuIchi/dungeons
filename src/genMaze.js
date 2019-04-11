const genMaze = (rows = 8, columns = 8) => {
  const ceils = Array(rows * columns)
    .fill(0)
    .map(() => ({
      dirs: [0, 0, 0, 0],
      visited: false,
    }));
  const initCeilIndex = Math.floor(Math.random() * ceils.length);
  const stack = [initCeilIndex];
  ceils[initCeilIndex].visited = true;
  let currentIndex = initCeilIndex;
  while (stack.length) {
    const dir = getRandomDir(currentIndex);
    const chosenIndex = getCeilIndexByDir(currentIndex, dir);
    if (chosenIndex !== null) {
      ceils[currentIndex].dirs[dir] = 1;
      ceils[chosenIndex].dirs[dir ^ 1] = 1;
      ceils[chosenIndex].visited = true;
      currentIndex = chosenIndex;
      stack.push(chosenIndex);
    } else {
      currentIndex = stack.pop();
    }
  }
  return ceils.map(c => c.dirs);
  function getRandomDir(i) {
    const row = Math.floor(i / columns);
    const column = i % columns;
    const dirs = [0, 1, 2, 3].filter((_, dir) => {
      if (row === 0 && dir === 0) return false;
      if (row === rows - 1 && dir === 1) return false;
      if (column === 0 && dir === 2) return false;
      if (column === columns - 1 && dir === 3) return false;
      if (ceils[getCeilIndexByDir(i, dir)].visited) return false;
      return true;
    });
    return dirs[Math.floor(Math.random() * dirs.length)];
  }
  function getCeilIndexByDir(i, dir) {
    switch (dir) {
      case 0:
        return i - columns;
      case 1:
        return i + columns;
      case 2:
        return i - 1;
      case 3:
        return i + 1;
      default:
        return null;
    }
  }
};
export default genMaze;
