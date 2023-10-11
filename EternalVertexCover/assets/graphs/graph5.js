export default graph = `digraph G {
0 [label="50 50"]
1 [label="300 50"]
2 [label="300 400"]
3 [label="50 400"]
4 [label="100 300"]
5 [label="100 150"]
6 [label="250 150"]
7 [label="250 300"]
0 -- 1
1 -- 2
2 -- 3
0 -- 3
4 -- 5
5 -- 6
6 -- 7
4 -- 7
3 -- 4
5 -- 0
6 -- 1
7 -- 2
}`;
