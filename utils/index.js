
const shortestNode = (costs, nodesAlreadyCall) => {
  return Object.keys(costs).reduce((lowest, node ) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!nodesAlreadyCall.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

// returns the minimum journey and path to reach finish
export const shortestJourney = (graph) => {
  const journeis = Object.assign({ finish: Infinity }, graph.start);
  const parents = { key: ""  } = { finish: null };

  for (let child in graph.start) {
    parents[child] = 'start';
  }

  const nodesAlreadyCall = [];

  let node = shortestNode(journeis, nodesAlreadyCall);

  while (node) {
    let cost = journeis[node];
    let children = graph[node];
    for (let n in children) {
      let newCost = cost + children[n];
      if (!journeis[n]) {
        journeis[n] = newCost;
        parents[n] = node;
      }
      if (journeis[n] > newCost) {
        journeis[n] = newCost;
        parents[n] = node;
      }
    }
    nodesAlreadyCall.push(node);
    node = shortestNode(journeis, nodesAlreadyCall);
  }
  let optimalPath = ['finish'];
  let parent = parents.finish;

  while (parent) {
    optimalPath.push(parent);
    parent = parents[parent];
  }

  optimalPath.reverse();
  const endOfJourney = {
    distance: journeis.finish,
    path: optimalPath.splice(1, optimalPath.length -2)
  };

  return endOfJourney;
};