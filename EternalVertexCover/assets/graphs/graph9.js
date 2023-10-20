export default graph = `digraph G {
0 [label="50 50"]
1 [label="175 50"]
2 [label="175 400"]
3 [label="50 400"]
4 [label="100 300"]
5 [label="100 150"]
6 [label="250 210"]
0 -- 1
0 -- 5
5 -- 1
1 -- 6
6 -- 4
4 -- 3
3 -- 2
4 -- 2
}`;
//0,1,4,2