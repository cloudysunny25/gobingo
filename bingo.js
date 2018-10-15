var length = document.getElementById("length");
var num = 0;
var flag = false;
var count=0;

//완성한 줄 카운팅을 위한 배열 초기화
function arrayInit(num){
    var arr = new Array();
    for(var i=0; i<num; i++){
        arr[i]=0;
    }
    return arr;
}


//완성한 줄의 갯수 계산
function getCount(arr, num){
    var cnt = 0;
    arr.forEach(function(value, index){
        if(value==num)
            cnt++;
    })
    return cnt;
}

//줄 수 입력칸 이벤트 정의
length.addEventListener("input", function(){
    document.getElementById("length2").value = this.value;
    num = Number(this.value);
    document.getElementById("ok").onclick = tableHandler(num);
})

//테이블(빙고판) 생성
function tableHandler(length){
    return function(event){
        //기존에 생성된 table과 count span이 있는지 확인하고, 있다면 삭제 처리
        var span = (document.querySelector("span"));
        if(span){
            document.body.removeChild(span);
        }
        var oldTable = document.getElementById("bgTable");
        if(oldTable){
            document.body.removeChild(oldTable);
        }
        document.getElementById("start").removeAttribute("disabled");

        count = 0;

        var table = document.createElement("table");
        table.setAttribute("id", "bgTable");
        for(var i = 0; i<length; i++){
            var tr = document.createElement("tr");
            for(var j = 0; j<length; j++){
                var edit = document.createElement("input");
                edit.setAttribute("type", "text");
                edit.setAttribute("class", "bg_input");
                var td = document.createElement("td");
                td.appendChild(edit);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }    
        document.body.appendChild(table);
    }
};

//게임 시작 버튼 클릭시 텍스트 입력 불가 및 셀 클릭 이벤트 적용
document.getElementById("start").onclick = function(){
    var rows = document.querySelector("table").querySelectorAll("tr");
    for(var i=0; i<rows.length; i++){
        var cols = rows[i].querySelectorAll("td");
        for(var j=0; j<cols.length; j++){
            var input = cols[j].querySelector("input");
            cols[j].removeChild(input);
            cols[j].appendChild(document.createTextNode(input.value));

            cols[j].addEventListener("click", function(event){
                if(!flag){
                    this.setAttribute("style", "background-color:red;");
                    flag = true;
                }else{
                    this.removeAttribute("style");
                    flag = false;
                }
                completeCheck();
                document.body.removeChild(document.querySelector("span"));
                var span = document.createElement("span");
                span.appendChild(document.createTextNode("count: "+count+"/"+rows.length));
                document.body.appendChild(span);

                if(count>=rows.length){
                    alert("clear!");
                    //더이상 클릭 되지 않게 처리해야
                }
            })
        }
    }

    //진행상황을 보여줄 span생성
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("count "+ count+"/"+rows.length));
    document.body.appendChild(span);

    //시작버튼 제어
    document.getElementById("start").setAttribute("disabled", true);
}

//몇 개의 줄을 완성했는지 점검(셀 클릭할 때마다)
function completeCheck(){
    var rows = document.querySelector("table").querySelectorAll("tr");

    var vCnt = arrayInit(rows.length);
    var hCnt = arrayInit(rows.length);
    var dCnt = arrayInit(rows.length);

    for(var i=0; i<rows.length; i++){
        var cols = rows[i].querySelectorAll("td");
        if(cols[i].hasAttribute("style")){//대각선1(\) 체크
            dCnt[0]++;
        }
        if(cols[rows.length-1-i].hasAttribute("style")){ // 대각선2(/)체크
            dCnt[1]++;
        }
        for(var j=0; j<cols.length; j++){
            var colChk = 0;
            if(cols[j].hasAttribute("style")){//세로 
                vCnt[j]+=1;
            }
            if(cols[j].hasAttribute("style")){//가로
                hCnt[i]+=1;
            }
        }
    }
    count = getCount(dCnt, rows.length)+getCount(vCnt, rows.length)+getCount(hCnt, rows.length);
}