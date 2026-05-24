import type { Subject, Module, Topic, StudentProgress } from "@/types";


export const MOCK_SUBJECT: Subject = {
  id: "sub_ada",
  code: "CS-401",
  title: "Algorithm Design and Analysis",
  description: "Comprehensive coverage of algorithm design techniques, asymptotic analysis, divide-and-conquer, greedy methods, dynamic programming, backtracking, and computability theory.",
  instructor: "Dr. Chirag Desai",
  credits: 4,
  semester: 7,
  coverColor: "from-violet-600 to-indigo-700",
  totalModules: 5,
  totalTopics: 0, // Computed below
};

// ─── eBook & Numericals HTML content helpers ─────────────────────────────────
const ebook = (title: string, sections: { h: string; p: string }[]) => `
<h1>${title}</h1>
${sections.map(s => `<h2>${s.h}</h2><p>${s.p}</p>`).join("")}
`;

const numerical = (problem: string, steps: string[]) => `
<h4>Problem:</h4>
<p class="text-white">${problem}</p>
<h4>Solution:</h4>
<div class="space-y-4">
  ${steps.map((step, i) => `
    <div class="bg-emerald-900/30 p-4 rounded-lg border border-emerald-800/50">
      <div class="text-xs text-emerald-500 font-bold mb-1">Step ${i + 1}</div>
      <div class="text-sm text-gray-200">${step}</div>
    </div>
  `).join("")}
</div>
`;

// ─── Topics ───────────────────────────────────────────────────────────────────
const moduleTopics: Record<string, Topic[]> = {
  mod_01: [
    {
      id: "top_1_1_a", moduleId: "mod_01", order: 1,
      title: "1.1 Basic Sorting: Selection, Insertion, Shell Sort",
      type: "video", durationMinutes: 45, isCompleted: true,
      videoId: "JU767SDMDvA", // Just a dummy ID, normally would be valid
    },
    {
      id: "top_1_1_b", moduleId: "mod_01", order: 2,
      title: "1.1 Advanced Sorting: Heap, Counting, Radix (Self-Learning)",
      type: "simulation", durationMinutes: 30, isCompleted: true,
      simulationUrl: "https://www.cs.usfca.edu/~galles/visualization/HeapSort.html",
      ebookContent: ebook("Heap Sort, Counting Sort & Radix Sort", [
        { h: "Heap Sort — Overview", p: "Heap Sort is a comparison-based sorting algorithm that uses a <strong>binary heap</strong> data structure. It first builds a max-heap from the input array, then repeatedly extracts the maximum element (root of the heap) and places it at the end of the sorted region. After each extraction, the heap property is restored using a 'heapify' operation." },
        { h: "Heap Sort — How It Works", p: "<strong>Step 1 — Build Max-Heap:</strong> Starting from the last non-leaf node (index n/2 - 1), call heapify on each node moving upward. This converts the array into a max-heap in O(n) time.<br/><br/><strong>Step 2 — Sort:</strong> Swap the root (maximum) with the last element, reduce heap size by 1, then heapify the root. Repeat n-1 times. Each heapify is O(log n), so the total sorting phase is O(n log n).<br/><br/><strong>Overall complexity:</strong> Time = O(n log n) in all cases. Space = O(1) — it sorts in-place. Heap Sort is <em>not stable</em> (equal elements may change order)." },
        { h: "Counting Sort — Non-Comparison Sort", p: "Counting Sort works by counting occurrences of each distinct element. It requires knowing the range of input values (say 0 to k).<br/><br/><strong>Algorithm:</strong> (1) Create a count array C[0..k], initialised to 0. (2) For each element x in input, increment C[x]. (3) Modify C so that C[i] = C[i] + C[i-1] (prefix sums). (4) Iterate input in reverse, place each element at index C[x]-1 in the output, and decrement C[x].<br/><br/><strong>Complexity:</strong> Time = O(n + k), Space = O(n + k). It is stable and very fast when k is small relative to n." },
        { h: "Radix Sort — Digit-by-Digit", p: "Radix Sort sorts numbers digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD). It uses a stable subroutine (typically Counting Sort) at each digit position.<br/><br/><strong>Algorithm:</strong> For d digits, apply Counting Sort on each digit from position 1 to d. Since each pass is O(n + b) where b is the base (e.g. 10), and there are d passes, total time is O(d·(n + b)). Radix Sort achieves linear time O(n) when the number of digits is constant." },
        { h: "When to Use Which?", p: "<strong>Heap Sort:</strong> Guaranteed O(n log n) with O(1) space, but not stable.<br/><strong>Counting Sort:</strong> When the range k is small and you need a stable, fast sort.<br/><strong>Radix Sort:</strong> When sorting large sets of integers/strings with bounded length — beats comparison-based sorts." },
      ]),
    },
    {
      id: "top_1_1_quiz", moduleId: "mod_01", order: 3,
      title: "Quiz: Sorting Algorithms",
      type: "quiz", durationMinutes: 15, isCompleted: true,
      quizQuestions: [
        { id: "q1", question: "Which sorting algorithm is NOT comparison based?", options: ["Heap Sort", "Insertion Sort", "Counting Sort", "Shell Sort"], correctIndex: 2, explanation: "Counting sort uses key frequencies rather than comparisons." },
        { id: "q2", question: "What is the worst-case time complexity of Insertion Sort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctIndex: 1, explanation: "O(n²) when the array is reverse sorted." },
      ],
    },
    {
      id: "top_1_2_a", moduleId: "mod_01", order: 4,
      title: "1.2 Asymptotic Notations & Order of Growth",
      type: "reading", durationMinutes: 40, isCompleted: false,
      ebookContent: ebook("Asymptotic Notations", [
        { h: "Big-O, Omega, and Theta", p: "Big-O gives an upper bound, Omega gives a lower bound, and Theta gives a tight bound. These describe how the runtime grows as the input size n increases." },
        { h: "Common Running Times", p: "From fastest to slowest: O(1) Constant, O(log n) Logarithmic, O(n) Linear, O(n log n) Linearithmic, O(n²) Quadratic, O(2ⁿ) Exponential." }
      ]),
      numericalsContent: numerical(
        "Show that f(n) = 3n² + 4n + 2 is O(n²).",
        [
          "We need to find constants c > 0 and n₀ ≥ 0 such that f(n) ≤ c·n² for all n ≥ n₀.",
          "For n ≥ 1, n ≤ n² and 1 ≤ n².",
          "So, 3n² + 4n + 2 ≤ 3n² + 4n² + 2n² = 9n².",
          "Thus, with c = 9 and n₀ = 1, f(n) ≤ 9n². Therefore, f(n) = O(n²)."
        ]
      )
    },
    {
      id: "top_1_assign", moduleId: "mod_01", order: 5,
      title: "Assignment: Rate of Growth Analysis",
      type: "assignment", durationMinutes: 60, isCompleted: false,
      assignmentDescription: "### Assignment 1: Analysis of Basic Algorithms\n\n1. Write a program to implement Radix Sort and empirically determine its running time by testing with n = 10k, 50k, 100k.\n2. Prove mathematically that log(n!) = Theta(n log n).\n\nSubmit your code and PDF report.",
    }
  ],

  mod_02: [
    {
      id: "top_2_1_a", moduleId: "mod_02", order: 1,
      title: "2.1 Divide and Conquer: Quick & Merge Sort",
      type: "video", durationMinutes: 50, isCompleted: false,
      videoId: "Hoixgm4-P4M",
    },
    {
      id: "top_2_1_b", moduleId: "mod_02", order: 2,
      title: "2.1 Strassen's Matrix Multiplication",
      type: "reading", durationMinutes: 30, isCompleted: false,
      ebookContent: ebook("Strassen's Algorithm", [
        { h: "The Concept", p: "Standard matrix multiplication takes O(n³). Strassen reduces the 8 multiplications in a 2x2 split to 7 multiplications, reducing the time complexity to O(n^2.81)." }
      ]),
      numericalsContent: numerical(
        "Derive the time complexity of Strassen's Algorithm.",
        [
          "The recurrence relation is T(n) = 7T(n/2) + O(n²).",
          "Here, a=7, b=2, f(n)=O(n²).",
          "Compare n^log_b(a) = n^log_2(7) ≈ n^2.81 with f(n) = n².",
          "Since n^2.81 > n², by Master Theorem Case 1, T(n) = Θ(n^log_2(7))."
        ]
      )
    },
    {
      id: "top_2_2_a", moduleId: "mod_02", order: 3,
      title: "2.2 Recurrence Relations & Master Theorem",
      type: "video", durationMinutes: 40, isCompleted: false,
      videoId: "mBNrRy2_hVs",
    },
    {
      id: "top_2_quiz", moduleId: "mod_02", order: 4,
      title: "Quiz: Recurrences & D&C",
      type: "quiz", durationMinutes: 20, isCompleted: false,
      quizQuestions: [
        { id: "q1", question: "What is the worst-case time complexity of Randomized Quick Sort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctIndex: 1, explanation: "Even randomized, worst-case is O(n²) if unlucky, but average is O(n log n)." },
        { id: "q2", question: "Solve T(n) = 2T(n/2) + O(n)", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], correctIndex: 2, explanation: "Master theorem case 2 applies, resulting in O(n log n)." },
      ],
    }
  ],

  mod_03: [
    {
      id: "top_3_1_a", moduleId: "mod_03", order: 1,
      title: "3.1 Greedy Approach: Prim's & Dijkstra's",
      type: "simulation", durationMinutes: 45, isCompleted: false,
      simulationUrl: "https://visualgo.net/en/sssp",
      ebookContent: ebook("Prim's & Dijkstra's Algorithms", [
        { h: "The Greedy Paradigm", p: "A greedy algorithm builds a solution piece by piece, always choosing the locally optimal option. For it to produce a correct result, the problem must exhibit the <strong>Greedy Choice Property</strong> (a globally optimal solution can always be arrived at by making locally optimal choices) and <strong>Optimal Substructure</strong> (an optimal solution to the problem contains optimal solutions to its subproblems)." },
        { h: "Prim's Algorithm — Minimum Spanning Tree", p: "<strong>Goal:</strong> Find a spanning tree connecting all vertices with minimum total edge weight.<br/><br/><strong>Algorithm:</strong> Start from any vertex. Maintain a set S of vertices already in the MST. At each step, add the cheapest edge that connects a vertex in S to a vertex outside S. Repeat until all vertices are included.<br/><br/><strong>Implementation:</strong> Use a min-priority queue keyed by edge weight. For each vertex u not yet in MST, store the minimum-weight edge connecting it to the MST. Extract-min gives the next vertex to add. Then update the keys of its neighbours.<br/><br/><strong>Complexity:</strong> With a binary heap: O(E log V). With a Fibonacci heap: O(E + V log V)." },
        { h: "Dijkstra's Algorithm — Single-Source Shortest Path", p: "<strong>Goal:</strong> Find shortest paths from a source vertex s to all other vertices in a graph with <em>non-negative</em> edge weights.<br/><br/><strong>Algorithm:</strong> Initialise dist[s] = 0 and dist[v] = ∞ for all other vertices. Use a min-priority queue ordered by dist values. Extract vertex u with minimum dist. For each neighbour v of u: if dist[u] + weight(u,v) < dist[v], update dist[v].<br/><br/><strong>Why non-negative weights?</strong> Once a vertex is extracted from the queue, its shortest distance is finalised. Negative weights would invalidate this guarantee. For negative weights, use Bellman-Ford instead.<br/><br/><strong>Complexity:</strong> O((V + E) log V) with a binary heap. O(V² + E) with an adjacency matrix." },
        { h: "Key Comparison: Prim's vs Dijkstra's", p: "Both use a greedy strategy with a priority queue, but they optimise different quantities:<br/>• <strong>Prim's</strong> minimises the <em>edge weight</em> connecting a new vertex to the current tree.<br/>• <strong>Dijkstra's</strong> minimises the <em>total path distance</em> from the source vertex.<br/><br/>The code structure is nearly identical — the only difference is what the priority queue key represents." },
      ]),
    },
    {
      id: "top_3_1_b", moduleId: "mod_03", order: 2,
      title: "3.1 Job Sequencing, Knapsack & Network Flow",
      type: "video", durationMinutes: 55, isCompleted: false,
      videoId: "zPtI8q9gvX8",
    },
    {
      id: "top_3_1_num", moduleId: "mod_03", order: 3,
      title: "Numerical: Fractional Knapsack",
      type: "reading", durationMinutes: 30, isCompleted: false,
      numericalsContent: numerical(
        "Find optimal profit for Fractional Knapsack: n=3, W=50. (v,w) = (60,10), (100,20), (120,30).",
        [
          "Calculate value/weight ratio for each item: I1=6, I2=5, I3=4.",
          "Sort items descending by ratio: I1, I2, I3.",
          "Take whole I1 (w=10). Remaining capacity = 40. Profit = 60.",
          "Take whole I2 (w=20). Remaining capacity = 20. Profit = 60 + 100 = 160.",
          "Take fraction of I3: 20/30. Profit added = (20/30)*120 = 80.",
          "Total profit = 160 + 80 = 240."
        ]
      )
    },
    {
      id: "top_3_2_a", moduleId: "mod_03", order: 4,
      title: "3.2 DP Principles: Overlapping Subproblems & Optimal Substructure",
      type: "video", durationMinutes: 60, isCompleted: false,
      videoId: "oBt53YbR9Kk",
    },
    {
      id: "top_3_2_sim1", moduleId: "mod_03", order: 5,
      title: "Simulation: 0/1 Knapsack (DP Table Builder)",
      type: "simulation", durationMinutes: 35, isCompleted: false,
      simulationUrl: "https://algorithm-visualizer.org/dynamic-programming/knapsack-problem",
      ebookContent: ebook("0/1 Knapsack — Interactive Deep Dive", [
        { h: "Problem Definition", p: "You are given n items. Each item i has a weight w<sub>i</sub> and a value v<sub>i</sub>. You have a knapsack that can carry at most W units of weight. You must select a subset of items to maximise total value without exceeding the weight limit. Each item is either fully taken (1) or left behind (0) — no fractions allowed." },
        { h: "Why Greedy Fails for 0/1 Knapsack", p: "Consider items (v=60,w=10), (v=100,w=20), (v=120,w=30) with W=50. The greedy approach by value/weight ratio picks items 1 and 2, using 30 weight and getting 160 value. But taking items 2 and 3 (weight 50) gives 220 value. The greedy choice is <em>not</em> globally optimal for 0/1 knapsack because you cannot take fractions." },
        { h: "DP Formulation", p: "Define <code>dp[i][w]</code> = maximum value achievable using items 1 through i with remaining capacity w.<br/><br/><strong>Base case:</strong> dp[0][w] = 0 for all w (no items means no value).<br/><br/><strong>Recurrence:</strong> For each item i and capacity w:<br/>• If w<sub>i</sub> > w: item i cannot fit, so dp[i][w] = dp[i−1][w]<br/>• Otherwise: dp[i][w] = max(dp[i−1][w], dp[i−1][w−w<sub>i</sub>] + v<sub>i</sub>)<br/><br/>The final answer is dp[n][W]." },
        { h: "Traceback — Finding Which Items to Include", p: "After filling the DP table, trace back from dp[n][W]:<br/>• If dp[i][w] ≠ dp[i−1][w], then item i was included. Move to dp[i−1][w−w<sub>i</sub>].<br/>• If dp[i][w] = dp[i−1][w], item i was not included. Move to dp[i−1][w].<br/>• Repeat until i = 0." },
        { h: "Complexity & Space Optimisation", p: "<strong>Time:</strong> O(nW). <strong>Space:</strong> O(nW) for the full table.<br/><br/><strong>Space optimisation:</strong> Use a single 1D array of size W+1. Iterate w from W down to w<sub>i</sub> (reverse order prevents using an item twice). This reduces space to O(W) but makes traceback impossible without the full table.<br/><br/><strong>Note:</strong> O(nW) is <em>pseudo-polynomial</em> — W is encoded in log W bits, so the runtime is exponential in the input size." },
      ]),
    },
    {
      id: "top_3_2_num1", moduleId: "mod_03", order: 6,
      title: "Numerical: 0/1 Knapsack Problem",
      type: "reading", durationMinutes: 30, isCompleted: false,
      ebookContent: ebook("0/1 Knapsack — Dynamic Programming", [
        { h: "Problem Statement", p: "Given n items, each with a weight wᵢ and value vᵢ, and a knapsack of capacity W, find the maximum value subset such that total weight ≤ W. Each item is either included (1) or excluded (0)." },
        { h: "Recurrence", p: "Define dp[i][w] = max value achievable using items 1..i with capacity w. If wᵢ > w, dp[i][w] = dp[i-1][w]. Otherwise, dp[i][w] = max(dp[i-1][w], dp[i-1][w-wᵢ] + vᵢ)." },
        { h: "Time & Space", p: "Time: O(nW), Space: O(nW). Can be optimized to O(W) space using a single row iterated in reverse." },
      ]),
      numericalsContent: numerical(
        "n=4, W=7. Items: (v,w) = (1,1), (4,3), (5,4), (7,5). Find max value.",
        [
          "Build a DP table dp[0..4][0..7], initializing row 0 to all zeros.",
          "Item 1 (v=1,w=1): For w=1..7, dp[1][w] = max(dp[0][w], dp[0][w-1]+1) = 1.",
          "Item 2 (v=4,w=3): dp[2][3]=max(dp[1][3], dp[1][0]+4)=4. dp[2][4]=max(1, dp[1][1]+4)=5.",
          "Item 3 (v=5,w=4): dp[3][4]=max(dp[2][4], dp[2][0]+5)=5. dp[3][5]=max(dp[2][5], dp[2][1]+5)=6. dp[3][7]=max(dp[2][7], dp[2][3]+5)=9.",
          "Item 4 (v=7,w=5): dp[4][5]=max(dp[3][5], dp[3][0]+7)=7. dp[4][6]=max(dp[3][6], dp[3][1]+7)=8. dp[4][7]=max(9, dp[3][2]+7)=9.",
          "Answer: dp[4][7] = 9. Traceback: items 2 & 3 selected (value 4+5=9, weight 3+4=7).",
        ]
      ),
    },
    {
      id: "top_3_2_sim2", moduleId: "mod_03", order: 7,
      title: "Simulation: Floyd-Warshall (All-Pairs Shortest Path)",
      type: "simulation", durationMinutes: 30, isCompleted: false,
      simulationUrl: "https://visualgo.net/en/sssp",
      ebookContent: ebook("Floyd-Warshall — All-Pairs Shortest Path", [
        { h: "What Does Floyd-Warshall Solve?", p: "Unlike Dijkstra's (single-source), Floyd-Warshall finds the shortest path between <strong>every pair</strong> of vertices in a weighted, directed graph. It handles <em>negative edge weights</em> (but not negative-weight cycles). It is ideal for dense graphs represented as adjacency matrices." },
        { h: "The Core Idea", p: "For each pair (i, j), check whether routing through an intermediate vertex k gives a shorter path:<br/><code>dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</code><br/><br/>We systematically try every possible intermediate vertex k from 1 to V. After considering all V intermediate vertices, dist[i][j] holds the true shortest path distance." },
        { h: "Algorithm (Pseudocode)", p: "<code>for k = 1 to V:</code><br/>&nbsp;&nbsp;<code>for i = 1 to V:</code><br/>&nbsp;&nbsp;&nbsp;&nbsp;<code>for j = 1 to V:</code><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>if dist[i][k] + dist[k][j] < dist[i][j]:</code><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code>dist[i][j] = dist[i][k] + dist[k][j]</code><br/><br/>Initialise dist[i][j] with the weight of edge (i,j), or ∞ if no direct edge exists. Set dist[i][i] = 0." },
        { h: "Detecting Negative Cycles", p: "After the algorithm completes, check the diagonal of the distance matrix. If any <code>dist[i][i] < 0</code>, then vertex i is part of a negative-weight cycle. This is because traversing a negative cycle allows you to keep reducing path length indefinitely." },
        { h: "Complexity & When to Use", p: "<strong>Time:</strong> O(V³) — three nested loops each running V times.<br/><strong>Space:</strong> O(V²) — the distance matrix.<br/><br/>Floyd-Warshall is simpler to code than running Dijkstra V times, but has worse asymptotic performance for sparse graphs. Use Floyd-Warshall when the graph is dense (E ≈ V²) or when you need all-pairs shortest paths with potential negative edges." },
      ]),
    },
    {
      id: "top_3_2_num2", moduleId: "mod_03", order: 8,
      title: "Numerical: Floyd-Warshall Algorithm",
      type: "reading", durationMinutes: 25, isCompleted: false,
      ebookContent: ebook("Floyd-Warshall Algorithm", [
        { h: "Overview", p: "Floyd-Warshall finds shortest paths between ALL pairs of vertices in a weighted graph. It works with negative weights (but not negative cycles). Time: O(V³), Space: O(V²)." },
        { h: "Recurrence", p: "dist[i][j] via vertex k = min(dist[i][j], dist[i][k] + dist[k][j]). We iterate k from 1 to V, updating the distance matrix each round." },
      ]),
      numericalsContent: numerical(
        "Apply Floyd-Warshall on a 4-vertex graph with adjacency matrix: [[0,3,∞,7],[8,0,2,∞],[5,∞,0,1],[2,∞,∞,0]].",
        [
          "Initialize D⁰ = adjacency matrix. D⁰[1][2]=3, D⁰[1][4]=7, D⁰[2][1]=8, D⁰[2][3]=2, D⁰[3][1]=5, D⁰[3][4]=1, D⁰[4][1]=2.",
          "k=1: Check if going through vertex 1 is shorter. D¹[2][4] = min(∞, D[2][1]+D[1][4]) = min(∞, 8+7) = 15. D¹[3][2] = min(∞, 5+3) = 8. D¹[4][2] = min(∞, 2+3) = 5.",
          "k=2: D²[1][3] = min(∞, D[1][2]+D[2][3]) = min(∞, 3+2) = 5. D²[4][3] = min(∞, 5+2) = 7.",
          "k=3: D³[1][4] = min(7, D[1][3]+D[3][4]) = min(7, 5+1) = 6. D³[2][4] = min(15, 2+1) = 3. D³[2][1] = min(8, 2+5) = 7.",
          "k=4: D⁴[3][1] = min(5, D[3][4]+D[4][1]) = min(5, 1+2) = 3. D⁴[3][2] = min(8, 1+5) = 6.",
          "Final matrix D⁴: [[0,3,5,6],[7,0,2,3],[3,6,0,1],[2,5,7,0]]. All shortest paths computed.",
        ]
      ),
    },
    {
      id: "top_3_2_sim3", moduleId: "mod_03", order: 9,
      title: "Simulation: Longest Common Subsequence (LCS)",
      type: "simulation", durationMinutes: 25, isCompleted: false,
      simulationUrl: "https://algorithm-visualizer.org/dynamic-programming/longest-common-subsequence",
      ebookContent: ebook("Longest Common Subsequence (LCS)", [
        { h: "Problem Statement", p: "Given two sequences X = x<sub>1</sub>x<sub>2</sub>...x<sub>m</sub> and Y = y<sub>1</sub>y<sub>2</sub>...y<sub>n</sub>, find the longest subsequence present in both. A <strong>subsequence</strong> preserves relative order but need not be contiguous — characters can be skipped. For example, the LCS of 'ABCBDAB' and 'BDCAB' is 'BCAB' (length 4)." },
        { h: "DP Formulation", p: "Define <code>dp[i][j]</code> = length of LCS of X[1..i] and Y[1..j].<br/><br/><strong>Base case:</strong> dp[0][j] = dp[i][0] = 0 (empty prefix has LCS of 0 with anything).<br/><br/><strong>Recurrence:</strong><br/>• If X[i] = Y[j]: dp[i][j] = dp[i−1][j−1] + 1 (extend the LCS by this matching character)<br/>• Else: dp[i][j] = max(dp[i−1][j], dp[i][j−1]) (skip one character from either X or Y and take the better option)" },
        { h: "Traceback — Reconstructing the Actual LCS", p: "Starting from dp[m][n], trace backward:<br/>• If X[i] = Y[j]: this character is in the LCS. Record it and move diagonally to dp[i−1][j−1].<br/>• If dp[i−1][j] ≥ dp[i][j−1]: move up to dp[i−1][j].<br/>• Else: move left to dp[i][j−1].<br/><br/>Characters collected in reverse give you the LCS string." },
        { h: "Real-World Applications", p: "LCS is widely used in:<br/>• <strong>Diff tools</strong> (e.g. git diff) — finding unchanged lines between file versions.<br/>• <strong>Bioinformatics</strong> — comparing DNA/protein sequences to find evolutionary similarity.<br/>• <strong>Spell checking & autocorrect</strong> — edit distance is closely related to LCS.<br/>• <strong>Plagiarism detection</strong> — finding common text passages between documents." },
        { h: "Complexity", p: "<strong>Time:</strong> O(m × n) — filling an m×n table.<br/><strong>Space:</strong> O(m × n) for the full table. Can be reduced to O(min(m,n)) if only the <em>length</em> is needed (not the actual subsequence). For reconstructing the LCS in linear space, use <strong>Hirschberg's algorithm</strong> (divide-and-conquer + LCS)." },
      ]),
    },
    {
      id: "top_3_2_num3", moduleId: "mod_03", order: 10,
      title: "Numerical: LCS & Matrix Chain Multiplication",
      type: "reading", durationMinutes: 35, isCompleted: false,
      ebookContent: ebook("LCS & MCM", [
        { h: "Longest Common Subsequence", p: "Given two strings X and Y, find the longest subsequence common to both. Recurrence: if X[i]==Y[j], dp[i][j]=dp[i-1][j-1]+1; else dp[i][j]=max(dp[i-1][j], dp[i][j-1]). Time: O(mn)." },
        { h: "Matrix Chain Multiplication", p: "Given a sequence of matrices, find the most efficient way to multiply them. The order of multiplication matters significantly. Recurrence: m[i,j] = min over k of (m[i,k] + m[k+1,j] + pᵢ₋₁·pₖ·pⱼ). Time: O(n³)." },
      ]),
      numericalsContent: numerical(
        "Find LCS of X = 'ABCBDAB' and Y = 'BDCAB'.",
        [
          "Build a table dp[0..7][0..5] initialized to 0.",
          "Fill row by row: when X[i]=Y[j], dp[i][j] = dp[i-1][j-1]+1. Else max(dp[i-1][j], dp[i][j-1]).",
          "Key fills: dp[1][4]=1 (A=A), dp[2][2]=1 (B=B), dp[3][3]=2 (C after B), dp[4][2]=2 (B=B).",
          "Final dp[7][5] = 4. LCS length = 4.",
          "Traceback from dp[7][5]: follow diagonals where characters match → LCS = 'BCAB'.",
        ]
      ),
    },
    {
      id: "top_3_quiz", moduleId: "mod_03", order: 11,
      title: "Quiz: DP Concepts & Applications",
      type: "quiz", durationMinutes: 20, isCompleted: false,
      quizQuestions: [
        { id: "q1", question: "What are the two key properties required for DP to be applicable?", options: ["Greedy choice & optimal substructure", "Overlapping subproblems & optimal substructure", "Divide & conquer", "Memoization & recursion"], correctIndex: 1, explanation: "DP requires overlapping subproblems (same subproblems solved repeatedly) and optimal substructure (optimal solution built from optimal sub-solutions)." },
        { id: "q2", question: "What is the time complexity of the 0/1 Knapsack DP solution?", options: ["O(n log n)", "O(n²)", "O(nW)", "O(2ⁿ)"], correctIndex: 2, explanation: "The DP table has n rows and W columns, and each cell is filled in O(1) time." },
        { id: "q3", question: "Floyd-Warshall handles which type of graphs?", options: ["Only positive weights", "Only unweighted", "Positive and negative weights (no negative cycles)", "Only DAGs"], correctIndex: 2, explanation: "Floyd-Warshall works with negative weights but cannot handle negative-weight cycles." },
        { id: "q4", question: "What is the space complexity of the standard LCS algorithm?", options: ["O(n)", "O(m+n)", "O(mn)", "O(1)"], correctIndex: 2, explanation: "The standard LCS uses a 2D table of size m×n. It can be optimized to O(min(m,n)) space if only the length is needed." },
      ],
    },
    {
      id: "top_3_assign", moduleId: "mod_03", order: 12,
      title: "Assignment: Greedy vs DP",
      type: "assignment", durationMinutes: 90, isCompleted: false,
      assignmentDescription: "### Assignment 3: Greedy & DP\n\n1. Implement Ford-Fulkerson algorithm to find the maximum flow in a given network.\n2. Solve the 0/1 Knapsack problem using DP for n=5 items and compare with the Fractional Knapsack greedy solution.\n3. Implement Floyd-Warshall and trace through a 5-vertex graph showing all D⁰ through D⁵ matrices.\n4. Write a detailed comparison between solving TSP using Dynamic Programming vs Branch and Bound.\n\nSubmit source files and documentation.",
    }
  ],

  mod_04: [
    {
      id: "top_4_1_a", moduleId: "mod_04", order: 1,
      title: "4.1 Backtracking: N-Queens & Sum of Subsets",
      type: "video", durationMinutes: 45, isCompleted: false,
      videoId: "xouin83ebxE",
    },
    {
      id: "top_4_2_a", moduleId: "mod_04", order: 2,
      title: "4.2 Branch and Bound: TSP & 15 Puzzle",
      type: "reading", durationMinutes: 45, isCompleted: false,
      ebookContent: ebook("Branch and Bound", [
        { h: "Concept", p: "Branch and Bound is a state space search method used for optimization problems. It keeps track of the best solution found so far (bound) and prunes branches that cannot yield a better solution." },
        { h: "TSP using B&B", p: "We build a state space tree where each node represents a partial tour. We calculate a lower bound on the cost of completing the tour. If the lower bound exceeds the current best complete tour cost, we prune the node." }
      ]),
    },
    {
      id: "top_4_quiz", moduleId: "mod_04", order: 3,
      title: "Quiz: State Space Search",
      type: "quiz", durationMinutes: 20, isCompleted: false,
      quizQuestions: [
        { id: "q1", question: "Which algorithm technique is usually applied for solving the N-Queens problem?", options: ["Greedy", "Dynamic Programming", "Backtracking", "Divide & Conquer"], correctIndex: 2, explanation: "Backtracking builds candidates and abandons them as soon as it determines they cannot lead to a valid solution." },
        { id: "q2", question: "Branch and Bound is primarily used for:", options: ["Decision problems", "Optimization problems", "Sorting", "Searching"], correctIndex: 1, explanation: "It explores branches to optimize a specific bound (minimize cost/maximize profit)." },
      ],
    }
  ],

  mod_05: [
    {
      id: "top_5_1_a", moduleId: "mod_05", order: 1,
      title: "5.1 Computability: P, NP, NP-Hard, NP-Complete",
      type: "video", durationMinutes: 35, isCompleted: false,
      videoId: "YX40hbAHx3s",
    },
    {
      id: "top_5_2_a", moduleId: "mod_05", order: 2,
      title: "5.2 NP Reducibility",
      type: "reading", durationMinutes: 40, isCompleted: false,
      ebookContent: ebook("NP Reducibility", [
        { h: "Polynomial Time Reduction", p: "Problem A is polynomially reducible to Problem B (A ≤p B) if an instance of A can be transformed into an instance of B in polynomial time, and the answers match." },
        { h: "Proving NP-Completeness", p: "To prove X is NP-Complete: 1) Prove X is in NP (solution verifiable in polynomial time). 2) Choose a known NP-Complete problem Y. 3) Prove Y ≤p X." }
      ]),
    },
    {
      id: "top_5_quiz", moduleId: "mod_05", order: 3,
      title: "Quiz: Complexity Classes",
      type: "quiz", durationMinutes: 15, isCompleted: false,
      quizQuestions: [
        { id: "q1", question: "If an NP-Complete problem is solved in polynomial time, then:", options: ["P != NP", "P = NP", "It becomes NP-Hard", "None of the above"], correctIndex: 1, explanation: "If any NP-Complete problem has a polynomial time algorithm, then all problems in NP do, meaning P=NP." },
      ],
    }
  ],
};

// ─── Modules — Mapped to Syllabus ──────────────────────────────────────────────
export const MOCK_MODULES: Module[] = [
  {
    id: "mod_01", subjectId: "sub_ada", order: 1, isLocked: false,
    title: "1. Analysis of Basic Algorithms",
    description: "Sorting algorithms, asymptotic notations, order of growth, and fundamental analysis techniques.",
    topics: moduleTopics.mod_01
  },
  {
    id: "mod_02", subjectId: "sub_ada", order: 2, isLocked: false,
    title: "2. Divide and Conquer Algorithms",
    description: "Quick sort, Merge sort, Strassen's algorithm, and solving recurrence relations via Master Theorem.",
    topics: moduleTopics.mod_02
  },
  {
    id: "mod_03", subjectId: "sub_ada", order: 3, isLocked: false,
    title: "3. Greedy Algorithms & DP",
    description: "Prim's, Dijkstra's, Fractional Knapsack, Flow Networks, OBST, Floyd-Warshall, LCS, and Matrix-chain.",
    topics: moduleTopics.mod_03
  },
  {
    id: "mod_04", subjectId: "sub_ada", order: 4, isLocked: false,
    title: "4. Backtracking & Branch and Bound",
    description: "N-Queens, Sum of Subsets, TSP via Branch and Bound, 15 Puzzle.",
    topics: moduleTopics.mod_04
  },
  {
    id: "mod_05", subjectId: "sub_ada", order: 5, isLocked: false,
    title: "5. Computability Theory",
    description: "P, NP, NP-Hard, NP-Complete definitions and polynomial-time reducibility concepts.",
    topics: moduleTopics.mod_05
  },
];

// Dynamically count total topics
MOCK_SUBJECT.totalTopics = MOCK_MODULES.reduce((acc, m) => acc + m.topics.length, 0);

export const MOCK_PROGRESS: StudentProgress = {
  studentId: "stu_001",
  subjectId: "sub_ada",
  completedTopics: ["top_1_1_a", "top_1_1_b", "top_1_1_quiz"],
  completedModules: [],
  lastAccessedAt: "2026-05-13T14:30:00Z",
  xpEarned: 1240,
  quizScores: { top_1_1_quiz: 100 },
};



// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getModuleProgress(module: Module, completedTopics: string[]): number {
  const total = module.topics.length;
  if (total === 0) return 0;
  const done = module.topics.filter((t) => completedTopics.includes(t.id)).length;
  return Math.round((done / total) * 100);
}

export function getSubjectProgress(completedTopics: string[]): number {
  const total = Object.values(moduleTopics).flat().length;
  return Math.round((completedTopics.length / total) * 100);
}

export function findTopic(moduleId: string, topicId: string): Topic | undefined {
  return moduleTopics[moduleId]?.find((t) => t.id === topicId);
}
