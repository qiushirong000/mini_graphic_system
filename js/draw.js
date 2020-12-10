
//绘制模式
var model=1;
var vertexs=0;
var pt_x=0,pt_y=0;
var ptc_x=0,ptc_y=0;
svg.on("mousedown",function(e){
    if(((model==1)||(model==2))&&(vertexs<2))
    {
        vertexs++;
        var p=d3.pointer(e);
        var p_x=Math.round(p[0]/20)-Xmaximum;
        var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"black",false,5);
        if(vertexs==2)
        {
            if(model==1)
                DDACreateLine(pt_x,pt_y,p_x,p_y);
            else 
                BresenhamLine(pt_x,pt_y,p_x,p_y);
        }
        pt_x=p_x;
        pt_y=p_y;
    }else if(model==3&&(vertexs<2)){
        vertexs++;
        var p=d3.pointer(e);
        var p_x=Math.round(p[0]/20)-Xmaximum;
        var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"black",false,5);
        if(vertexs==2)
        {
            var radiux=Math.round(Math.sqrt(Math.pow((pt_y-p_y),2)+Math.pow((pt_x-p_x),2)));
            console.log("radiux="+radiux);
            midPointCircle(pt_x,pt_y,radiux);
        }
        pt_x=p_x;
        pt_y=p_y;
    }else if(model==4&&(vertexs<3)){
        var p=d3.pointer(e);
        var p_x=Math.round(p[0]/20)-Xmaximum;
        var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
        if(vertexs>0)
        {
            var flag=(ptc_x-p_x)*(ptc_y-p_y);
            if((flag!=0)&&(vertexs==1)){
                alert("位置选取不合理，长轴和短轴的必须与x轴或y轴平行！");
                return;
            }else if(vertexs==2){
                var flag2=(ptc_x-p_x)*(ptc_x-pt_x)+(ptc_y-pt_y)*(ptc_y-p_y);
                if(flag2!=0){
                    alert("位置选取不合理，长轴和短轴的必须与x轴或y轴平行！");
                    return;
                }
            }
        }
        vertexs++;
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"black",false,5);
        if(vertexs==3){
            var rx,ry;
            if((ptc_x-p_x)==0)
                rx=Math.abs(ptc_x-pt_x);
            else
                rx=Math.abs(ptc_x-p_x);
            if((ptc_y-p_y)==0)
                ry=Math.abs(ptc_y-pt_y);
            else
                ry=Math.abs(ptc_y-p_y);
            midPointEllipse(ptc_x,ptc_y,rx,ry);
        }
        if(vertexs==1){
            ptc_x=p_x;
            ptc_y=p_y;
        }else{
            pt_x=p_x;
            pt_y=p_y;
        }
        
    }else if(model==5){
        DrawPolygon(e);
    }else if(model==6){
        //多边形裁剪算法
        if(object=='polygon')
        {
            draw_polygons(e);
        }else if(object=='window'){
            draw_window(e);
        }
    }
    
});



function selectChange()
{
    PointNumber = 0;
    board.html('');
    array={};
    model=parseInt(document.getElementById("options").value);
    console.log("model="+model);
    vertexs=0;
    tr_reset();
    if(model!=6){
        document.getElementById("draw_polygon").type='hidden';
        document.getElementById("draw_window").type='hidden';
        document.getElementById("cut").type='hidden';
    }else{
        alert("按顺时针方向绘制多边形！");
        document.getElementById("draw_polygon").type='button';
        document.getElementById("draw_window").type='button';
        document.getElementById("cut").type='button';
    }
}

var array={};
var PointNumber=0;
function putpixel(x,y,color="black",link=true,radiux=10)
{
    array[x+","+y]=1;
    if(link)
        PointNumber++;
    var circle=board.append("circle")
            .attr("cx",scale_x(x))
            .attr("cy",scale_y(y))   
            .attr("r",0)
            .transition()
            .attr("r",radiux)
            .style("fill",color)
            .duration(500)
            .delay(PointNumber*250);
}



//绘制多边形

var states={"drawing":0,"fill":1,"end":2};
var dp_model=states["drawing"];
//定义可动态变化的二维数组
var points=new Array();
points[0]=new Array();
points[1]=new Array();
points[2]=new Array();

var points_index=0;
//存储起点坐标
var s_x=-99,x_y=-99;

function DrawPolygon(e)
{
    var p=d3.pointer(e);
    var p_x=Math.round(p[0]/20)-Xmaximum;
    var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
    if(dp_model==states["drawing"])
    {
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"black",false,5);
        if((s_x!=p_x)||(s_y!=p_y))
        {
            points[0][points_index]=p_x;
            points[1][points_index]=p_y;
            points[2][points_index]=1;
            if(points_index==0){
                s_x=p_x;
                s_y=p_y; 
            }else{
                PointNumber = 0;
                BresenhamLine(points[0][points_index-1],points[1][points_index-1],p_x,p_y,"black");
            }
            points_index++;
            console.log(points);
        }else{
            //到达结束点
            PointNumber = 0;
            BresenhamLine(points[0][points_index-1],points[1][points_index-1],p_x,p_y,"black");
            dp_model=states["fill"];
            // shaft.attr("r",10);
        }
    }else if(dp_model==states["fill"]){
        scanFill(p_x,p_y);
        dp_model=states["end"];
    }
}

function tr_reset(){
    dp_model=states["drawing"];
    points[0]=[];
    points[1]=[];
    points[2]=[];
    s_x=-99,x_y=-99;
    points_index=0;
    // shaft.attr("r",0);
    // board.html('');
}


function drawLine(x1,y1,x2,y2,color){
    board.append("line")
    .attr("x1",scale_x(x1))
    .attr("y1",scale_y(y1))
    .attr("x2",scale_x(x2))
    .attr("y2",scale_y(y2))
    .attr("stroke",color)
    .attr("z-index",99)
    .attr("stroke-width","4px");
}

//多边形裁剪算法
//1.绘制多边形，一个为裁剪窗口，一个为多边形
var object = 'polygon';//操作对象
var points_1=new Array();
var len_1=0;
points_1[0] = [0.0,0.0];

var points_2=new Array();
var len_2=0;
points_2[0] = [0,0];

function draw_polygons(e)
{
    var p=d3.pointer(e);
    var p_x=Math.round(p[0]/20)-Xmaximum;
    var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
    //绘制多边形
    if(dp_model==states["drawing"])
    {
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"black",false,5);
        if((s_x!=p_x)||(s_y!=p_y))
        {
            points_1[points_index][0]=p_x;
            points_1[points_index][1]=p_y;
            if(points_index==0){
                s_x=p_x;
                s_y=p_y; 
                len_1=1;
            }else{
                drawLine(points_1[points_index-1][0],points_1[points_index-1][1],p_x,p_y,"black");
            }
            points_index++;
            points_1[points_index]=[0,0];
        }else{
            //到达结束点
            points_1[points_index]=points_1[0];
            len_1=points_index;
            console.log("len_1="+len_1);
            drawLine(points_1[0][0],points_1[0][1],points_1[points_index-1][0],points_1[points_index-1][1],"black");
            dp_model=states["end"];
            board.html('');
            console.log(points_1);

            //绘制多边形
            var polygon=f1_board.selectAll("polygon")
                .data([points_1])
                .enter().append("polygon")
                .attr("points",function(d) { 
                    return d.map(function(d) {
                        return [scale_x(d[0]),scale_y(d[1])].join(",");
                    }).join(" ");
                })
                .attr("id","polygon")
                .attr("stroke","black")
                .attr("stroke-width",2)
                .call(d3.drag()
                .on("start", p_started)
                .on("drag", p_dragged)
                .on("end", p_dragended));
            // console.log(polygon);   
        }
    }
}


function draw_window(e)
{
    var p=d3.pointer(e);
    var p_x=Math.round(p[0]/20)-Xmaximum;
    var p_y=-1*(Math.round(p[1]/20)-Ymaximum);
    //绘制多边形
    if(dp_model==states["drawing"])
    {
        console.log(p_x+","+p_y);
        putpixel(p_x,p_y,"red",false,5);
        if((s_x!=p_x)||(s_y!=p_y))
        {
            points_2[points_index][0]=p_x;
            points_2[points_index][1]=p_y;
            if(points_index==0){
                s_x=p_x;
                s_y=p_y; 
                len_2=1;
            }else{
                drawLine(points_2[points_index-1][0],points_2[points_index-1][1],p_x,p_y,"red");
            }
            points_index++;
            points_2[points_index]=[0,0];
        }else{
            //到达结束点
            points_2[points_index]=points_2[0];
            len_2=points_index;
            console.log("len_1="+len_1);
            drawLine(points_2[0][0],points_2[0][1],points_2[points_index-1][0],points_2[points_index-1][1],"black");
            dp_model=states["end"];
            board.html('');
            console.log(points_2);

            //绘制多边形
            var polygon=f2_board.selectAll("polygon")
                .data([points_2])
                .enter().append("polygon")
                .attr("points",function(d) { 
                    return d.map(function(d) {
                        return [scale_x(d[0]),scale_y(d[1])].join(",");
                    }).join(" ");
                })
                .attr("id","window")
                .attr("stroke","red")
                .attr("stroke-width",2)
                .attr("fill","red")
                .call(d3.drag()
                .on("start", p_started)
                .on("drag", p_dragged)
                .on("end", p_dragended));
            }
    }

}


//鼠标交互事件
var s_event={'x':0,'y':0};
var dis={'x':0,'y':0};
function p_started(event) {
    console.log(event.x+","+event.y);
    s_event.x=event.x;
    s_event.y=event.y;
}
function p_dragged(event) {
    dis.x=event.x-s_event.x;
    dis.y=event.y-s_event.y;
    d3.select(this).attr("points",function(d) { 
        return d.map(function(d) {
            return [scale_x(d[0])+dis.x,scale_y(d[1])+dis.y].join(",");
        }).join(" ");
    });
}
function p_dragended(event) {
    var lx=dis.x/(scale_x(1)-scale_x(0));
    var ly=dis.y/(scale_y(1)-scale_y(0));
    console.log(lx+','+ly);
    // console.log(points_1);
    // console.log(points_1.length);
    var id=d3.select(this).attr("id");
    // console.log("id="+id);
    if(id=="polygon"){
        //此处不能理解为什么不需要对最后一个顶点进行处理
        for(var i=0;i<(points_1.length-1);i++)
        {
            console.log("i="+i);
            points_1[i][0]+=lx;
            points_1[i][1]+=ly;
        }
        console.log(points_1);
    }else if(id=="window"){
        for(var i=0;i<(points_2.length-1);i++)
        {
            console.log("i="+i);
            points_2[i][0]+=lx;
            points_2[i][1]+=ly;
        }
    }
}

