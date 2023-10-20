export default graph = `digraph G {
0 [label="50 50"]
1 [label="175 50"]
2 [label="175 400"]
3 [label="50 400"]
4 [label="100 300"]
5 [label="100 150"]
6 [label="250 210"]
7 [label="380 210"]
8 [label="380 350"]
9 [label="380 100"]
0 -- 5
5 -- 4
6 -- 4
6 -- 7
7 -- 8
7 -- 9
4 -- 3
6 -- 2
6 -- 1
1 -- 5
}`;
//5,1,4,6,7