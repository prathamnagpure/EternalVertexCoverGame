export default `digraph G {
0 [label="200 50"]
1 [label="300 150"]
2 [label="300 300"]
3 [label="200 450"]
4 [label="100 300"]
5 [label="100 150"]
0 -- 1
1 -- 2
2 -- 3
3 -- 4
4 -- 5
5 -- 0
0 -- 3
5 -- 2
}`;
//0,2,4
