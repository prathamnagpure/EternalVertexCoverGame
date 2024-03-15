export default `digraph G {
0 [label="50 50"]
1 [label="175 50"]
2 [label="300 50"]
3 [label="50 200"]
4 [label="300 200"]
0 -- 1
1 -- 2
3 -- 1
4 -- 1
0 -- 3
3 -- 4
4 -- 2
}`;
