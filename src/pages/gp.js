import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TreeViz = ({ node, x, y, px, py, depth = 0 }) => {
  if (!node) return null;
  const isOp = typeof node !== 'string';
  const val = isOp ? node.operator : node;
  
  const baseSpacing = 120;
  const levelSpacing = 60;
  const spacing = baseSpacing / Math.pow(1.4, depth);

  return (
    <g>
      {px !== undefined && (
        <line 
          x1={px} y1={py} x2={x} y2={y} 
          stroke="#666" strokeWidth="2"
        />
      )}
      <circle
        cx={x} cy={y} r={20}
        fill={isOp ? "#4f46e5" : "#10b981"}
        stroke="#fff" strokeWidth="2"
      />
      <text
        x={x} y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        {val}
      </text>
      {isOp && (
        <>
          <TreeViz 
            node={node.left} 
            x={x - spacing} 
            y={y + levelSpacing} 
            px={x} py={y}
            depth={depth + 1}
          />
          <TreeViz 
            node={node.right} 
            x={x + spacing} 
            y={y + levelSpacing} 
            px={x} py={y}
            depth={depth + 1}
          />
        </>
      )}
    </g>
  );
};

const GeneticRegression = () => {
  // GP Constants
  const ops = ['+', '-', '*', '/'];
  const terms = ['x', '1', '2', '3', '4', '5'];
  const populationSize = 100;
  const tournamentSize = 5;
  const mutationRate = 0.1;

  // State
  const [pop, setPop] = useState([]);
  const [gen, setGen] = useState(0);
  const [bestFit, setBestFit] = useState(Infinity);
  const [bestExpr, setBestExpr] = useState('');
  const [bestTree, setBestTree] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ avgFitness: Infinity, bestEver: Infinity });

  // Helper functions
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  // Tree Creation and Evaluation
  const createTree = (d = 0, max = 4) => {
    if (d >= max || (d > 1 && Math.random() < 0.3)) return terms[rand(0, terms.length-1)];
    return {
      operator: ops[rand(0, ops.length-1)],
      left: createTree(d+1, max),
      right: createTree(d+1, max)
    };
  };

  const evalTree = (t, x) => {
    try {
      if (typeof t === 'string') return t === 'x' ? x : parseFloat(t);
      const l = evalTree(t.left, x), r = evalTree(t.right, x);
      switch(t.operator) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return r === 0 ? 1 : l / r;
      }
    } catch { return Infinity; }
  };

  // Expression Simplification
  const expandBrackets = (tree) => {
    if (typeof tree === 'string') return tree;
    let left = expandBrackets(tree.left);
    let right = expandBrackets(tree.right);

    if (tree.operator === '*') {
      if (typeof right !== 'string' && ['+', '-'].includes(right.operator)) {
        return {
          operator: right.operator,
          left: { operator: '*', left, right: right.left },
          right: { operator: '*', left, right: right.right }
        };
      }
      if (typeof left !== 'string' && ['+', '-'].includes(left.operator)) {
        return {
          operator: left.operator,
          left: { operator: '*', left: left.left, right },
          right: { operator: '*', left: left.right, right }
        };
      }
    }

    return { operator: tree.operator, left, right };
  };

  const simplifyTree = (tree) => {
    if (typeof tree === 'string') return tree;
    let left = simplifyTree(tree.left);
    let right = simplifyTree(tree.right);

    // Numeric operations
    if (!isNaN(parseFloat(left)) && !isNaN(parseFloat(right))) {
      const l = parseFloat(left), r = parseFloat(right);
      switch(tree.operator) {
        case '+': return (l + r).toString();
        case '-': return (l - r).toString();
        case '*': return (l * r).toString();
        case '/': return r !== 0 ? (l / r).toString() : '1';
      }
    }

    // Algebraic identities
    switch(tree.operator) {
      case '+':
        if (left === '0') return right;
        if (right === '0') return left;
        if (left === right) return { operator: '*', left: '2', right: left };
        break;
      case '*':
        if (left === '0' || right === '0') return '0';
        if (left === '1') return right;
        if (right === '1') return left;
        break;
      case '-':
        if (right === '0') return left;
        if (left === right) return '0';
        break;
      case '/':
        if (right === '1') return left;
        if (left === '0') return '0';
        if (left === right) return '1';
        break;
    }

    return { operator: tree.operator, left, right };
  };

  // Expression to String
  const getPrecedence = op => {
    switch(op) {
      case '*': case '/': return 2;
      case '+': case '-': return 1;
      default: return 0;
    }
  };

  const toStr = (tree, parentOp = null) => {
    if (typeof tree === 'string') return tree;
    
    const currPrec = getPrecedence(tree.operator);
    const leftStr = toStr(tree.left, tree.operator);
    const rightStr = toStr(tree.right, tree.operator);
    
    const needBrackets = parentOp && currPrec < getPrecedence(parentOp);
    const rightNeedsBrackets = (tree.operator === '/' || tree.operator === '-') && 
                              typeof tree.right !== 'string';
    
    let expr = '';
    
    if (typeof tree.left !== 'string' && getPrecedence(tree.left.operator) < currPrec) {
      expr += `(${leftStr})`;
    } else {
      expr += leftStr;
    }
    
    expr += ` ${tree.operator} `;
    
    if (rightNeedsBrackets || 
        (typeof tree.right !== 'string' && getPrecedence(tree.right.operator) <= currPrec)) {
      expr += `(${rightStr})`;
    } else {
      expr += rightStr;
    }
    
    return needBrackets ? `(${expr})` : expr;
  };

  // Evolution
  const fitness = t => {
    try {
      return data.reduce((e,p) => {
        const pred = evalTree(t, p.x);
        return e + (isNaN(pred) || !isFinite(pred) ? Infinity : Math.abs(pred - p.y));
      }, 0);
    } catch { return Infinity; }
  };

  const evolve = () => {
    if (!pop.length) return;
    
    const select = () => {
      const tournament = Array(tournamentSize).fill().map(() => pop[rand(0, pop.length-1)]);
      return tournament.reduce((a,b) => fitness(a) < fitness(b) ? a : b);
    };

    const crossover = (a, b) => {
      if (typeof a === 'string' || typeof b === 'string') return Math.random()<0.5 ? a : b;
      return Math.random()<0.5 ? {
        operator: a.operator,
        left: crossover(a.left, b.left),
        right: crossover(a.right, b.right)
      } : Math.random()<0.5 ? a : b;
    };

    const mutate = t => {
      if (typeof t === 'string') return Math.random()<mutationRate ? terms[rand(0,terms.length-1)] : t;
      return {
        operator: Math.random()<mutationRate ? ops[rand(0,ops.length-1)] : t.operator,
        left: mutate(t.left),
        right: mutate(t.right)
      };
    };
    
    const newPop = [pop.reduce((a,b) => fitness(a) < fitness(b) ? a : b)];
    while (newPop.length < populationSize) {
      newPop.push(mutate(crossover(select(), select())));
    }
    
    const best = newPop.reduce((a,b) => fitness(a) < fitness(b) ? a : b);
    const fit = fitness(best);
    
    if (fit < bestFit) {
      setBestFit(fit);
      const expanded = expandBrackets(best);
      const simplified = simplifyTree(expanded);
      setBestTree(simplified);
      setBestExpr(toStr(simplified));
      setData(data.map(p => ({...p, predicted: evalTree(simplified, p.x)})));
    }

    const fits = newPop.map(fitness);
    const avgFit = fits.reduce((a,b) => a + b) / fits.length;
    setStats(s => ({
      avgFitness: avgFit,
      bestEver: Math.min(s.bestEver, fit)
    }));
    
    setPop(newPop);
    setGen(g => g + 1);
  };

  // Initialization
  useEffect(() => {
    setData(Array.from({length:21}, (_,i) => {
      const x = -5 + i*0.5;
      const y = x*x + 2*x + 1;
      return {x, y, predicted:y};
    }));
    setPop(Array(populationSize).fill().map(() => createTree()));
  }, []);

  useEffect(() => {
    const id = isRunning ? setInterval(evolve, 100) : null;
    return () => id && clearInterval(id);
  }, [isRunning, pop]);

  const reset = () => {
    setIsRunning(false);
    setPop(Array(populationSize).fill().map(() => createTree()));
    setGen(0);
    setBestFit(Infinity);
    setBestExpr('');
    setBestTree(null);
    setData(d => d.map(p => ({...p, predicted: p.y})));
    setStats({ avgFitness: Infinity, bestEver: Infinity });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div styles={styles.header}>
          <h2>Genetic Programming: Symbolic Regression</h2>
        </div>
        <div style={styles.content}>
          <div style={styles.control}>
            <button 
                style={styles.button}
                className={`button ${isRunning ? 'stop' : 'start'}`}
                onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>
            <button 
                style={styles.resetButton}
                onClick={reset}
            >
              Reset
            </button>
          </div>
          
          <div style={styles.statsContainer}>
            <div style={styles.stats}>Generation: {gen}</div>
            <div style={styles.stats}>Best Fitness: {bestFit.toFixed(4)}</div>
            <div style={styles.stats}>Avg Fitness: {stats.avgFitness.toFixed(4)}</div>
            <div style={styles.stats}>Best Ever: {stats.bestEver.toFixed(4)}</div>
            <div style={styles.expression}>Best Expression: {bestExpr}</div>
          </div>

          <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart style={styles.chart} width={700} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="x"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="y" stroke="#8884d8" name="Target"/>
              <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted"/>
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2>Expression Tree</h2>
        </div>
        <div style={styles.treeContainer}>
          <ResponsiveContainer width="100%" height={400}>
          <div style={styles.treeCanvas}>
            <svg width="100%" height={400} viewBox="-200 -50 400 450">
              <TreeViz node={bestTree} x={0} y={40} depth={0} />
            </svg>
          </div>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    width: '100%',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  control: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    width: '8rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    color: 'black',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    width: '8rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
  },
  statsItem: {
    fontSize: '0.875rem',
    color: '#1f2937',
  },
  expression: {
    fontFamily: 'monospace',
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    marginTop: '0.5rem',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  treeContainer: {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    padding: '1rem',
    border: '1px solid #e5e7eb',
  },
  treeCanvas: {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
};

export default GeneticRegression;