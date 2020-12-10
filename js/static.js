var width=620,height=500,
    margin={left:55,top:20,right:20,buttom:20};
var svg=d3.select('#DrawingBoard')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .attr("transform","translate("+margin.left+","+margin.top+")");

var step=20;
    g_height=height-step,//600px
    g_width=width-step;//480px 根据下面设置的坐标轴值可知间隔为20px

var g=d3.select('svg')
    .append('g');

var Xmaximum=15,Ymaximum=12;
//设置数据范围同svg比例增大或缩小
var scale_x=d3.scaleLinear()
            .domain([-1*Xmaximum,Xmaximum])//输入范围
            .range([0,g_width]);//输出范围
            
var scale_y=d3.scaleLinear()
            .domain([-1*Ymaximum,Ymaximum])
            .range([g_height,0]);
//添加坐标系
var x_axis=d3.axisBottom().scale(scale_x).ticks(2*Xmaximum).tickPadding(5).tickSize(480) ,
    y_axis=d3.axisRight().scale(scale_y).ticks(2*Ymaximum).tickPadding(5).tickSize(600) ;

    g.append('g')
    .call(x_axis);
    g.append('g')
    .call(y_axis);

    //标注坐标轴
    g.append("line")
    .attr("x1",scale_x(0))
    .attr("y1",scale_y(12))
    .attr("x2",scale_x(0))
    .attr("y2",scale_y(-12))
    .attr("stroke","red")
    .attr("stroke-width","2px");
    g.append("line")
    .attr("x1",scale_x(-15))
    .attr("y1",scale_y(0))
    .attr("x2",scale_x(15))
    .attr("y2",scale_y(0))
    .attr("stroke","red")
    .attr("stroke-width","2px");
    
//画板，所有绘制的图元在上面显示
var board=d3.select('svg')
    .append('g');

var f2_board=d3.select('svg')
    .append('g');

var f1_board=d3.select('svg')
    .append('g');