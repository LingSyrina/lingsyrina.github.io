      var canvas, ctx, code, point, style, drag = null, dPoint;

      var x_points = [[],[],[],[],[],[],[]]; 
      //two dimensional array Note: [[]] syntax did NOT work well for me. 4 [] because we have four blobs
      var y_points= [[],[],[],[],[],[],[]];
      var ctrl_x_first= [[],[],[],[],[],[],[]]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
      var ctrl_y_first=[[],[],[],[],[],[],[]];
      var ctrl_x_second=[[],[],[],[],[],[],[]];
      var ctrl_y_second=[[],[],[],[],[],[],[]];
      var move_ctrl=0;
      var c2=0;
      var m=0;
      var b=0;
      var horizontal_rec_y=0; //safest to declare each variable separate so that they're not equal to the same object
      var horizontal_rec_x=0;
      var center_x,center_y=0;
      var distortion_amount=70;
      var intrablob_distance=800; //difference between blobs on screen
      var num_ctrls=6;
      var offset=1.7;
      var blob_offset=10; //how much blobs are offset on screen

      x_points[0]= [80,240,350,110,260,150];
      y_points[0]= [190,130,270,450,330,270];
      x_points[1] = cloneObject(x_points[0]);
      y_points[1]= cloneObject(y_points[0]);
      x_points[4] = cloneObject(x_points[0]);
      y_points[4]= cloneObject(y_points[0]);

      ctrl_x_first[0]= [182, 255, 262, 215,310,190]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
      ctrl_y_first[0]=[148, 239, 519, 166,90,140];

      ctrl_x_first[1]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[1]=cloneObject(ctrl_y_first[0]);;

      ctrl_x_first[4]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[4]=cloneObject(ctrl_y_first[0]);;

      distort(1,0,3.14159/4,distortion_amount); //(which blob, which control point, angle of movement, amount of distortion)  .  pi/4 is 45 degrees

      distort(1,1,3.14159*3/4,distortion_amount); //3*pi/4 = 135 degrees

      distort(1,2,3.14159*5/4,distortion_amount); //5*pi/4 = 225 degrees

      distort(1,3,3.14159/2,distortion_amount);

  distort(1,4,3.14159/6,distortion_amount);

  distort(1,5,3.14159*4/6,distortion_amount);


      // start
      canvas = document.getElementById("canvas");
      if (canvas.getContext) {
            ctx = canvas.getContext("2d");
            Init(canvas.className == "quadratic");
    var gradient=ctx.createRadialGradient(blob_offset, blob_offset, 0, blob_offset, blob_offset, 20);;

      }



      center_x=0;
      center_y=0;


      function cloneObject(obj) {
          if (obj === null || typeof obj !== 'object') {
              return obj;
          }
          var temp = obj.constructor(); // give temp the original obj's constructor
          for (var key in obj) {
              temp[key] = cloneObject(obj[key]);
          }
          return temp;
      }


      function distort (blob,ctrl,angle,distance) //angle is in radians.  Straight up = pi/2
      {
            ctrl_x_first[blob][ctrl]= ctrl_x_first[blob][ctrl]+ Math.cos(angle)*distance;
            ctrl_y_first[blob][ctrl]= ctrl_y_first[blob][ctrl]+Math.sin(angle)*distance;
            return;
      }

      // define initial points
      function Init(quadratic) {



            // default styles
            style = {
                  curve:      { width: 6, color: "#333" },
                  cpline:     { width: 1, color: "#C00" },
                  point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
            }

            // line style defaults
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // event handlers
            canvas.onmousedown = DragStart;
            canvas.onmousemove = Dragging;
            canvas.onmouseup = canvas.onmouseout = DragEnd;
            DrawCanvas();
      }

      function flipped   (px,py,cx,cy)
      {
            nx=(cx-px)+cx;
            ny=(cy-py)+cy;
            return [nx,ny];
      };


function DrawBezier(which,cx,cy)
{

      center_x=cx;
      center_y=cy;


      c2=flipped(ctrl_x_first[which][1],ctrl_y_first[which][1],x_points[which][1],y_points[which][1]); //want the second control point to be the 180 flipped version of the subsequent first control point
      ctrl_x_second[which][0]=c2[0]; //x coord
      ctrl_y_second[which][0]=c2[1]; //y coord

       c2=flipped(ctrl_x_first[which][2],ctrl_y_first[which][2],x_points[which][2],y_points[which][2]);
      ctrl_x_second[which][1]=c2[0];
      ctrl_y_second[which][1]=c2[1];

       c2=flipped(ctrl_x_first[which][3],ctrl_y_first[which][3],x_points[which][3],y_points[which][3]);
      ctrl_x_second[which][2]=c2[0];
      ctrl_y_second[which][2]=c2[1];

  c2=flipped(ctrl_x_first[which][4],ctrl_y_first[which][4],x_points[which][4],y_points[which][4]);
 ctrl_x_second[which][3]=c2[0];
 ctrl_y_second[which][3]=c2[1];

   c2=flipped(ctrl_x_first[which][5],ctrl_y_first[which][5],x_points[which][5],y_points[which][5]);
  ctrl_x_second[which][4]=c2[0];
  ctrl_y_second[which][4]=c2[1];

       c2=flipped(ctrl_x_first[which][0],ctrl_y_first[which][0],x_points[which][0],y_points[which][0]);  //wraps around to first point
      ctrl_x_second[which][5]=c2[0];
      ctrl_y_second[which][5]=c2[1];


      ctx.lineWidth = 6;
      ctx.beginPath();

      ctx.moveTo(x_points[which][0]+center_x, y_points[which][0]+center_y);
      ctx.bezierCurveTo(ctrl_x_first[which][0]+center_x,ctrl_y_first[which][0]+center_y,ctrl_x_second[which][0]+center_x,ctrl_y_second[which][0]+center_y,x_points[which][1]+center_x,y_points[which][1]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
      ctx.bezierCurveTo(ctrl_x_first[which][1]+center_x,ctrl_y_first[which][1]+center_y,ctrl_x_second[which][1]+center_x,ctrl_y_second[which][1]+center_y,x_points[which][2]+center_x,y_points[which][2]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
      ctx.bezierCurveTo(ctrl_x_first[which][2]+center_x,ctrl_y_first[which][2]+center_y,ctrl_x_second[which][2]+center_x,ctrl_y_second[which][2]+center_y,x_points[which][3]+center_x,y_points[which][3]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
      ctx.bezierCurveTo(ctrl_x_first[which][3]+center_x,ctrl_y_first[which][3]+center_y,ctrl_x_second[which][3]+center_x,ctrl_y_second[which][3]+center_y,x_points[which][4]+center_x,y_points[which][4]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
  ctx.bezierCurveTo(ctrl_x_first[which][4]+center_x,ctrl_y_first[which][4]+center_y,ctrl_x_second[which][4]+center_x,ctrl_y_second[which][4]+center_y,x_points[which][5]+center_x,y_points[which][5]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
  ctx.bezierCurveTo(ctrl_x_first[which][5]+center_x,ctrl_y_first[which][5]+center_y,ctrl_x_second[which][5]+center_x,ctrl_y_second[which][5]+center_y,x_points[which][0]+center_x,y_points[which][0]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point

  ctx.strokeStyle="#1a1a1a";
  ctx.fillStyle = "red";
      ctx.fill();

}

      // draw canvas
      function DrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle="#1a1a1a";
    ctx.beginPath();
            ctx.rect(0,0,1200,1200);
            ctx.stroke();
          //gradient = ctx.createRadialGradient(blob_offset, blob_offset, 0, blob_offset, blob_offset, 20);
          //gradient.addColorStop(0, 'red');
          //gradient.addColorStop(1,'white');
            DrawBezier(0,blob_offset,blob_offset);
            DrawBezier(1,intrablob_distance+blob_offset,blob_offset);
            DrawBezier(4,blob_offset+intrablob_distance/2,blob_offset+intrablob_distance/2);
      }

      function DragStart(e) {
            e = MousePos(e);
      }

      // end dragging
      function DragEnd(e) {
            drag = null;
            canvas.style.cursor = "default";
            DrawCanvas();
      }


      // dragging
      function Dragging(e) {
            e = MousePos(e);
            for (var j = 0; j < num_ctrls; j++) {
      m=(ctrl_x_first[1][j]-ctrl_x_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
                  b=ctrl_x_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
                  horizontal_rec_x=(e.x-100)*offset*m+b;
                  m=(ctrl_y_first[1][j]-ctrl_y_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
                  b=ctrl_y_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
                  horizontal_rec_y=(e.x-100)*offset*m+b;
                  ctrl_x_first[4][j]=horizontal_rec_x;
                  ctrl_y_first[4][j]=horizontal_rec_y;
            }
                  DrawCanvas();
      }


      // event parser
      function MousePos(event) {
            event = (event ? event : window.event);
            return {
                  x: event.pageX - canvas.offsetLeft,
                  y: event.pageY - canvas.offsetTop
            }
      }
