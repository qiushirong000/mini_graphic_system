//DAA画线算法
function DDACreateLine(x1,y1,x2,y2)
{
    var dx=x2-x1;
    var dy=y2-y1;
    var x=x1;
    var y=y1;
    var epsl,xIncre,yIncre,k;
    if(Math.abs(dx)>Math.abs(dy)) epsl=Math.abs(dx);
    else epsl=Math.abs(dy);
    xIncre=parseFloat(dx/epsl);
    yIncre=parseFloat(dy/epsl);
    for(k = 0; k<=epsl; k++){
        putpixel(parseInt(Math.round(x)), parseInt(Math.round(y)));
        x += xIncre;
        y += yIncre;
    }
    board.append("line")
    .attr("x1",scale_x(x1))
    .attr("y1",scale_y(y1))
    .attr("x2",scale_x(x2))
    .attr("y2",scale_y(y2))
    .attr("stroke","red")
    .attr("z-index",99)
    .attr("stroke-width","4px");
}


//Bresenhamline画线算法
function BresenhamLine(x1,y1,x2,y2)
{
    var dx,dy,x,y,p,const2,inc,tmp;
    dx=x2-x1;
    dy=y2-y1;
    if(dx*dy>=0)
        inc=1;
    else
        inc=-1;
    if(Math.abs(dx)>Math.abs(dy)){
        if(dx<0){
            tmp=x1;
            x1=x2;
            x2=tmp;
            tmp=y1;
            y1=y2;
            y2=tmp;
            dx=-dx;
            dy=-dy;
        }

        if(inc==1){
            p=2*dy-dx;
            const1=2*dy;
            const2=2*(dy-dx);
        }else if(inc==-1){
            p=2*dy+dx;
            const1=2*dy;
            const2=2*(dy+dx);
        }
        
        x=x1;
        y=y1;
        putpixel(x,y);
        while(x<x2){
            x++;
            if((inc*p)<0)//重点，此处的inc有判断的作用，使得1a和4a现象能够共用循环
                p+=const1;
            else{
                y+=inc;
                p+=const2;
            }
            putpixel(x,y);
        }
    }else{
        if(dy<0){
            tmp=x1;
            x1=x2;
            x2=tmp;
            tmp=y1;
            y1=y2;
            y2=tmp;
            dx=-dx;
            dy=-dy;
        }
        if(inc==1){
            p=2*dx-dy;
            const1=2*dx;
            const2=2*(dx-dy);
        }else if(inc==-1){
            p=2*dx+dy;
            const1=2*dx;
            const2=2*(dy+dx);
        }
        x=x1;
        y=y1;
        putpixel(x,y);		
        while(y<y2){
            y++;
            if((inc*p)<0){
                p+=const1;
            }else{
                x+=inc;
                p+=const2;
            }
            putpixel(x,y);
        }
    }
    board.append("line")
    .attr("x1",scale_x(x1))
    .attr("y1",scale_y(y1))
    .attr("x2",scale_x(x2))
    .attr("y2",scale_y(y2))
    .attr("stroke","red")
    .attr("z-index",99)
    .attr("stroke-width","4px");
}


//中点画圆算法
function midPointCircle(x,y,R)
{
    array={};//存储边界点
    var xa,ya;
    var p;
    xa=0;ya=R;
    putpixel(xa+x,ya+y);
    putpixel(ya+x,xa+y);
    putpixel(-ya+x,xa+y);
    putpixel(-xa+x,-ya+y);


    p=parseFloat(5*1.0/4-R);
    while(xa<ya){
        xa++;
        if(p<0){
            p=p+2.0*xa+1.0;
        }else{
            ya=ya-1;
            p=p+2.0*xa+1.0-ya*2.0;
        }
        putpixel(xa+x,ya+y);
        putpixel(ya+x,xa+y);
        putpixel(-ya+x,xa+y);
        putpixel(-xa+x,-ya+y);
        putpixel(-xa+x,ya+y);
        putpixel(-ya+x,-xa+y);
        putpixel(ya+x,-xa+y);
        putpixel(xa+x,-ya+y);
    }
    // document.getElementById("fill").type="button";
}

//中点椭圆算法
function midPointEllipse(x,y,rx,ry)
{
    array={};//存储边界点
    var xa,ya,p1,p2;
    p1=parseFloat(ry*ry-rx*rx*ry+rx*rx/4);
    xa=0,ya=ry;
    putpixel(xa+x,ya+y);
    putpixel(xa+x,-ya+y);
    while((2.0*ry*ry*xa)<(2.0*rx*rx*ya))
    {
        xa++;
        if(p1<0){
            p1=p1+2.0*ry*ry*xa+ry*ry;
        }else{
            ya=ya-1;
            p1=p1+2.0*ry*ry*xa+ry*ry-2.0*rx*rx*ya;
        }
        putpixel(xa+x,ya+y);
        putpixel(-xa+x,ya+y);
        putpixel(-xa+x,-ya+y);
        putpixel(xa+x,-ya+y);
    }
    p2=parseFloat(ry*ry*(xa+1.0/2)*(xa+1.0/2)+rx*rx*(ya-1.0)-rx*rx*ry*ry);
    while(ya>=0){
        if(p2>0){
            p2=p2-2.0*rx*rx*ya+rx*rx;
        }else{
            xa=xa+1;
            p2=p2-2.0*rx*rx*ya+rx*rx+2.0*ry*ry*xa;
        }
        putpixel(xa+x,ya+y);
        putpixel(-xa+x,ya+y);
        putpixel(-xa+x,-ya+y);
        putpixel(xa+x,-ya+y);
        ya--;
    }
    // document.getElementById("fill").type="button";
}


//扫描线种子填充算法
function scanFill(x,y)
{
    PointNumber=0;
    var fillcolor="red";
    var xl,xr,i;
    var spanNeedFill=false;
    var stack=new Array();//创建栈结构
    var pt={x:0,y:0};
    pt.x=x;
    pt.y=y;
    stack.push(pt);//种子点进栈
    while(stack.length>0){
        var t=stack.pop();
        x=t.x;
        y=t.y;
        while(array[x+","+y]!=1){//判断当前像素点是否被填充
            putpixel(x,y,fillcolor,false);
            x++;
        }
    
        xr=x-1;//右边界

        x=t.x-1;
        while(array[x+","+y]!=1){
            putpixel(x,y,fillcolor,false);
            x--;
        }
        xl=x+1;//左边界

        
        //处理上一条扫描线
        x=xl;
        y=y+1;
        while(x<=xr){
            console.log("test0");
            spanNeedFill=false;
            while(array[x+","+y]!=1){
                spanNeedFill=true;
                x++;
            }
            if(spanNeedFill){
                var pt={x:0,y:0};
                pt.x=x-1;
                pt.y=y;
                stack.push(pt);
                spanNeedFill=false;
            }
            while(array[x+","+y]==1&&x<=xr)
                x++;
        }
        
        //处理下一条扫描线
        x=xl;
        y=y-2;
        while(x<=xr){
            spanNeedFill=false;
            while(array[x+","+y]!=1){
                spanNeedFill=true;
                x++;
            }
            
            if(spanNeedFill){
                var pt={x:0,y:0};
                pt.x=x-1;
                pt.y=y;
                stack.push(pt);
                spanNeedFill=false;
            }
            while(array[x+","+y]==1&&x<=xr)
                x++;
        }
        
    }
}


function find_intersection( p0, p1, p2, p3 )
{
    var s10_x = p1[0] - p0[0];
    var s10_y = p1[1] - p0[1];
    var s32_x = p3[0] - p2[0];
    var s32_y = p3[1] - p2[1];
    var denom = s10_x * s32_y - s32_x * s10_y;
    if(denom==0) return null;//平行

    var denom_is_positive = denom > 0;
    var s02_x = p0[0] - p2[0];
    var s02_y = p0[1] - p2[1];
    var s_numer = s10_x * s02_y - s10_y * s02_x;
    if ((s_numer < 0) == denom_is_positive)
        return null;

    var t_numer = s32_x * s02_y - s32_y * s02_x;
    if ((t_numer < 0) == denom_is_positive)
        return null;

    if ((s_numer > denom) == denom_is_positive || (t_numer > denom) == denom_is_positive)
         return null;
    
    //俩条线段相交，有交点
    var t = t_numer / denom;
    intersection_point = [ parseFloat((p0[0] + (t * s10_x)).toFixed(2)),parseFloat((p0[1] + (t * s10_y)).toFixed(2))];
    return intersection_point;
}


var points_3=new Array();
points_3[0] = [0,0,0];
var pt3_index=0;
var flag=0;//判断是出点还是入点

function cut_polygon_array()
{
    points_3=new Array();
    points_3[0] = [0,0,0];
    pt3_index=0;
    flag=0;
    // console.log(points_1);
    for(var i=0;i<(points_1.length-1);i++)
    {
        points_3[pt3_index][0]=points_1[i][0];
        points_3[pt3_index][1]=points_1[i][1];
        points_3[pt3_index][2]=0;//标记位，0表示原始订点，1表示入点，-1表示出点
        pt3_index++;
        points_3[pt3_index] = [0,0,0];
        var temp=new Array();
        for(var j=0;j<(points_2.length-1);j++){
            var p=find_intersection(points_1[i],points_1[i+1],points_2[j],points_2[j+1]);
            if(p!=null)
                temp.push(p);
        }
        if(temp.length>0)
        {
            if((points_1[i+1][0]-points_1[i][0])>0){
                //升序
                temp.sort(function(x, y){
                    return x[0]-y[0];
                });
            }else if((points_1[i+1][0]-points_1[i][0])<0){
                //逆序
                temp.sort(function(x, y){
                    return y[0]-x[0];
                });
            }else{
                if((points_1[i+1][1]-points_1[i][1])>0)
                    temp.sort(function(x, y){
                        return x[1]-y[1];
                    });
                else{
                    temp.sort(function(x, y){
                        return y[1]-x[1];
                    });
                }
            }
            // console.log(temp);

            //记录第一个出入点标记
            if(flag==0)
            {
                if(d3.polygonContains(points_2,points_1[i]))
                    flag=-1;
                else
                    flag=1;
            }
            for(var t=0;t<temp.length;t++)
            {
                points_3[pt3_index][0]=temp[t][0];
                points_3[pt3_index][1]=temp[t][1];
                points_3[pt3_index][2]=flag;//标记位，0表示原始订点，1表示入点，-1表示出点
                flag=-flag;
                pt3_index++;
                points_3[pt3_index] = [0,0,0];
            }
        }  
    }
    points_3.length=points_3.length-1;
    console.log(points_3);
}

var points_4=new Array();
points_4[0] = [0,0,0];
var pt4_index=0;
function cut_window_array()
{
    points_4=new Array();
    points_4[0] = [0,0,0];
    pt4_index=0;
    flag=0;
    // console.log(points_1);
    for(var i=0;i<(points_2.length-1);i++)
    {
        points_4[pt4_index][0]=points_2[i][0];
        points_4[pt4_index][1]=points_2[i][1];
        points_4[pt4_index][2]=0;//标记位，0表示原始订点，1表示入点，-1表示出点
        pt4_index++;
        points_4[pt4_index] = [0,0,0];
        var temp=new Array();
        for(var j=0;j<(points_1.length-1);j++){
            var p=find_intersection(points_2[i],points_2[i+1],points_1[j],points_1[j+1]);
            if(p!=null)
                temp.push(p);
        }
        if(temp.length>0)
        {
            if((points_2[i+1][0]-points_2[i][0])>0){
                //升序
                temp.sort(function(x, y){
                    return x[0]-y[0];
                });
            }else if((points_2[i+1][0]-points_2[i][0])<0){
                //逆序
                temp.sort(function(x, y){
                    return y[0]-x[0];
                });
            }else{
                if((points_2[i+1][1]-points_2[i][1])>0)
                    temp.sort(function(x, y){
                        return x[1]-y[1];
                    });
                else{
                    temp.sort(function(x, y){
                        return y[1]-x[1];
                    });
                }
            }
            // console.log(temp);

            //记录第一个出入点标记
            if(flag==0)
            {
                if(d3.polygonContains(points_1,points_2[i]))
                    flag=1;
                else
                    flag=-1;
            }
            for(var t=0;t<temp.length;t++)
            {
                points_4[pt4_index][0]=temp[t][0];
                points_4[pt4_index][1]=temp[t][1];
                points_4[pt4_index][2]=flag;//标记位，0表示原始订点，1表示入点，-1表示出点
                flag=-flag;
                pt4_index++;
                points_4[pt4_index] = [0,0,0];
            }
        }
    }
    points_4.length=points_4.length-1;
    console.log(points_4);
}

var points_s=new Array();
var points_o=new Array();
function weilerr_Atherton()
{
    // f1_board.html('');
    points_o=[];
    points_s=[];
    var polygon_num=0;
    while(1){
        //判断是否还有入点
        var p3_index=-1,p4_index=-1,po_index=0;
        for(var i=0;i<(points_3.length);i++)
        {
            if(points_3[i][2]==1){
                points_s=points_3[i];
                p3_index=i;
                console.log("start index="+p3_index);
                polygon_num++;
                break;
            }
        }
        //入点查找完毕，程序结束
        if(p3_index==-1)
            break;

        points_o[0]=[0,0];
        while(1){
            var m=p3_index;
            points_3[m][2]=0;
            console.log("in="+m);
            while(points_3[m][2]!=-1){
                points_o[po_index][0]=points_3[m][0];
                points_o[po_index][1]=points_3[m][1];
                console.log(points_3[m][0]+","+points_3[m][1]);
                po_index++;
                points_o[po_index]=[0,0];
                m=(m+1)%(points_3.length);
            }
            console.log("out="+m);
            var t=points_3[m];
            for(var t1=0;t1<(points_4.length);t1++)
            {
                if((points_3[m][0]==points_4[t1][0])&&(points_3[m][1]==points_4[t1][1])&&(points_4[t1][2]==-1))
                {
                    p4_index=t1;
                    points_3[m][2]=0;
                }
            }
        
            var n=p4_index;
            points_4[n][2]=0;
            console.log("w_in="+n);
            while(points_4[n][2]!=1){
                points_o[po_index][0]=points_4[n][0];
                points_o[po_index][1]=points_4[n][1];
                console.log(points_4[n][0]+","+points_4[n][1]);
                po_index++;
                points_o[po_index]=[0,0];
                n=(n+1)%(points_4.length);
            }
            console.log("w_out="+n);

            var tt=points_4[n];
            for(var t1=0;t1<(points_3.length);t1++)
            {
                if((points_4[n][0]==points_3[t1][0])&&(points_4[n][1]==points_3[t1][1])&&(points_4[n][2]==1))
                {
                    p3_index=t1;
                    points_4[n][2]=0;
                }
            }

            //判断终点是否等于起点
            if((points_s[0]==points_4[n][0])&&(points_s[1]==points_4[n][1]))
            {
                if(polygon_num==1)
                    f1_board.html('');
                points_o[po_index][0]=points_o[0][0];
                points_o[po_index][1]=points_o[0][1];

                console.log("cut polygon :")
                console.log(points_o);

                draw_cut_polygon(points_o);
                break;
            }
        }
    }

}

function draw_cut_polygon(data)
{
    var polygon=f1_board
                .append("polygon")
                .data([data])
                .attr("points",function(d) { 
                    return d.map(function(d) {
                        return [scale_x(d[0]),scale_y(d[1])].join(",");
                    }).join(" ");
                })
                .attr("id","polygon")
                .attr("stroke","black")
                .attr("stroke-width",2)
                .attr("fill","black")
                .call(d3.drag()
                .on("start", p_started)
                .on("drag", p_dragged)
                .on("end", p_dragended));
}