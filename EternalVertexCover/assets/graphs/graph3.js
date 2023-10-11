export default graph = `digraph G {
0 [label="100 50"]
1 [label="200 50"]
2 [label="200 200"]
3 [label="100 200"]
4 [label="150 125"]
0 -- 1
1 -- 2
2 -- 3
0 -- 3
4 -- 3
4 -- 2
4 -- 1
4 -- 0
}`;
