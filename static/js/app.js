
    // List Course
    function listCourses() {
    const h2 = document.getElementById("hC2");
    h2.innerHTML = "<u>List Course</u>";

    const url = 'http://127.0.0.1:5000/elearning/courses'
    fetch(url)
    .then(response => response.json())
    .then(json => renderJson(json))
    }

    function renderJson(json) {
        const row = document.createElement("div");
        row.classList.add("row");
        const listCourse = document.getElementById("sCourses");
        listCourse.innerHTML = "";
        for (const data of json) {
            const h3 = document.createElement("h3");
            const p = document.createElement("p");
            const img = document.createElement("img");
            
            const column = document.createElement("button");
            const content = document.createElement("div");
            
            column.id = data["course_id"]
            column.classList.add("column");
            content.classList.add("content");
           
            img.src = data.img_src;
            img.alt = data.title;
            img.title = data.title;
            h3.innerHTML = data.title;
            p.innerHTML = data.description;

            content.append(img, h3, p);
            column.append(content);
            row.append(column);
            listCourse.append(row);

            if (`${document.cookie.search("std_token")}` == 0 || document.cookie == "") {
            column.addEventListener("click", function(e){
                e.preventDefault;
                let courseid = this.getAttribute("id");
                const url = new URL(`${window.origin}/course`);
                url.searchParams.set("id",`${courseid}`);
                window.location = url;
            })
        }}
    }

    // Course Overview
    function courseOverview(){
        let cid = window.location.search;
        let courseId = new URLSearchParams(cid); 
        let course_id = courseId.get("id");

        const url = `http://127.0.0.1:5000/elearning/course-overview?course_id=${course_id}`
        fetch(url)
        .then(response => response.json())
        .then(json => {
            const overview = document.querySelector(".overview");
            const h2 = document.getElementById("hC2");
            h2.innerHTML = " ";
            const courseOverview = document.getElementById("sCourses");
            courseOverview.innerHTML = "";
            for (data of json) {
                h2.innerHTML = data.title;
                const tombol = document.querySelector(".btn");
                const table = document.createElement("table");
                const tr1 = document.createElement("tr");
                const tr2 = document.createElement("tr");
                const tr3 = document.createElement("tr");
                const tr4 = document.createElement("tr");
                const tr5 = document.createElement("tr");
                const tr6 = document.createElement("tr");
                
                const img = document.createElement("td");
                img.setAttribute("rowspan", "6");
                img.innerHTML = `<img src=${data["img_src"]} alt=${data["title"]} title=${data["title"]}>`;
                const courseTitle = document.createElement("td");
                courseTitle.innerHTML =`<b>${data.title}</b>`;
                courseTitle.classList.add("title");
                const courseDesc = document.createElement("td");
                courseDesc.innerHTML = "Description : <br>" + data.description;
                courseDesc.classList.add("description");
                const courseInstructor = document.createElement("td");
                courseInstructor.innerHTML = "Instructor Name : " + data["first_name"] + " " + data["last_name"];
                courseInstructor.classList.add("instructor")
                const courseCount = document.createElement("td");
                courseCount.innerHTML = "Total Students Enrollment(s) : " + " " + data.count + " student(s)";
                courseCount.classList.add("enrollments")

                const btn = document.createElement("button");
                const bck = document.createElement("button");
                const txt = document.createTextNode("Enroll");
                const txt1 = document.createTextNode("Back")
                
                table.id = "courseOverview"
                btn.id = data["course_id"];
                btn.classList.add("enroll");
                bck.classList.add("back");
                bck.setAttribute("onclick", "goHistory()")

                bck.append(txt1);
                btn.append(txt);
                tr1.append(img, courseTitle);
                tr2.append(courseDesc);
                tr3.append(courseInstructor);
                tr4.append(courseCount);

                const url1 = `http://127.0.0.1:5000/elearning/prerequisite?course_id=${course_id}`
                fetch(url1)
                .then(response => response.json())
                .then(result => {
                    const coursePrerequisite = document.createElement("td");
                    coursePrerequisite.innerHTML = "Prerequisite(s): "
                    tr5.append(coursePrerequisite);
                    for (i= 0; i < result.length; i++) {
                        pre = result[i]["title"];
                        if (pre != null) {
                            const Pre = document.createElement("div")
                            Pre.classList.add("prerequisites")
                            Pre.innerHTML = pre;
                            tr6.append(Pre);
                        }else {
                            const Pre = document.createElement("div")
                            Pre.classList.add("prerequisites")
                            Pre.innerHTML = "-";
                            tr6.append(Pre);
                        }
                    }
                })       

                table.append(tr1,tr2,tr3,tr4,tr5,tr6);
                tombol.append(bck, btn);
                courseOverview.append(table);
                overview.append(courseOverview, tombol);

                if (`${document.cookie.search("std_token")}` == 0 || document.cookie == "") {
                btn.addEventListener("click", function(e){
                    let courseid = this.getAttribute("id");
                    e.preventDefault();
                    const url1 =`http://127.0.0.1:5000/elearning/courses/new/enroll?std_token${getCookie("std_token")}&course_id=${courseid}`
                    fetch(url1, {method: "POST"})
                    .then(response => response.json())
                    .then(result =>{
                        if (result == "Can't Add Enroll the Course Because Maximum Enroll of Five" || result == "Can't Add Enroll the Course Because Prerequisite Courses Haven't Completed yet" || result == "Course has been taken") {
                            alert(result);
                        }
                        else if(result == "Please, login first!"){
                            alert(result);
                            window.location = `${window.origin}/sign-in`;
                        } else{ 
                            console.log(result);
                            alert("Thanks! The Course has been added");
                            window.location = `${window.origin}/student-index`;
                        }
                    })
                })
            }
        }
    })
}

    function getCookied(name) {
        const value = `${document.cookie}`;
        const parts = value.split(`${name}=`);
        if (parts.length === 2){
            return parts.pop().split(';').shift();
        }
    }

    // Search Course
    window.doSearch = function() {
    let value = document.getElementById("course").value;
    const url1 = new URL(`${window.origin}/index/search`)
    url1.searchParams.set("q", `${value}`)
    window.location = url1
    }
    window.searches = function() {
    let val = window.location.search;
    let search = new URLSearchParams(val); 
    let value = search.get("q");
    const url = "http://127.0.0.1:5000/elearning/courses/search?value=" + value
    const h2 = document.getElementById("hC2");
    h2.innerHTML = "Search : " + value;
    const row = document.createElement("div");
    row.classList.add("row");
    fetch(url)
    .then(response => response.json())
    .then(json => {
        const searchCourse = document.getElementById("sCourses");
        searchCourse.innerHTML = "";
        if (json == `Sorry, we couldn't find any results for ${value}`){
            const p = document.createElement("p");
            p.innerHTML = json;
            searchCourse.append(p);
        } else {
        for (data of json) {
            const h3 = document.createElement("h3");
            const img = document.createElement("img");
            const p = document.createElement("p");
            const column = document.createElement("button");
            const content = document.createElement("div");
            
            column.id = data["course_id"]
            column.classList.add("column");
            content.classList.add("content");
           
            img.src = data.img_src;
            img.alt = data.title;
            img.title = data.title;
            h3.innerHTML = data.title;
            p.innerHTML = data.description;

            content.append(img, h3, p);
            column.append(content);
            row.append(column);
            searchCourse.append(row);
        
            if (`${document.cookie.search("std_token")}` == 0 || document.cookie == "") {
                column.addEventListener("click", function(e){
                    e.preventDefault;
                    let courseid = this.getAttribute("id");
                    const url2 = new URL(`${window.origin}/course`);
                    url2.searchParams.set("id",`${courseid}`);
                    window.location = url2
                })
            } 
        }
    }})
}

    // Top Course
    window.topCourse = function() {
    const h2 = document.getElementById("topCourse");
    h2.innerHTML = "<u>Top Courses</u>";

    const url = "http://127.0.0.1:5000/elearning/courses/top/enrolled"
    fetch(url)
    .then(response => response.json())
    .then(json => renderDatum(json))
    }
    function renderDatum(json) {
        const row = document.createElement("div");
        row.classList.add("row");
        const topCourse = document.getElementById("topCourses");
        topCourse.innerHTML = "";
        for (data of json) {
            const h3 = document.createElement("h3");
            const p = document.createElement("p");
            const img = document.createElement("p");
            
            const column = document.createElement("div");
            const content = document.createElement("div");
            
            column.classList.add("column");
            content.classList.add("content");

            h3.innerHTML = data["title"];
            p.innerHTML = "Number of courses enrolled : " + data["number of courses enrolled"] + " student(s)";
            img.innerHTML = `<img src=${data["img_src"]} alt=${data["title"]} title=${data["title"]}>`;

            content.append(img, h3, p);
            column.append(content);
            row.append(column);
            topCourse.append(row);
        }
    }
    // Top Student
    window.topStudent = function() {
    const h2 = document.getElementById("topStudent");
    h2.innerHTML = "<u>Top Students</u>";

    const url = "http://127.0.0.1:5000/elearning/courses/top/student"
    fetch(url)
    .then(response => response.json())
    .then(json => renderResult(json))
    }
    function renderResult(json) {
        const row = document.createElement("div");
        row.classList.add("row");
        const topCourse = document.getElementById("topStudents");
        topCourse.innerHTML = "";
        for (data of json) {
            const h3 = document.createElement("h3");
            const p = document.createElement("p");
            
            const column = document.createElement("div");
            const content = document.createElement("div");
            
            
            column.classList.add("column");
            content.classList.add("content");

            h3.innerHTML = data["first_name"] + " " +  data["last_name"];
            p.innerHTML = "Number of complete course: " + data["number of complete course"];

            content.append(h3, p);
            column.append(content);
            row.append(column);
            topCourse.append(row);
        }
    }

                 //------ register_student.html ------//

    // Enrollment
    function getCookie(name) {
        const value = `${document.cookie}`;
        const parts = value.split(`${name}`);
        if (parts.length === 2){
        return parts.pop().split(';').shift();
        } else if (value == "") {
            return ""
        }
    }


    // List Progress Course Student
    function statusCourse() {
        let id = getCookie("std_token")
        const url = "http://127.0.0.1:5000/elearning/courses/status?std_token" + id
        fetch(url)
        .then(response => response.json())
        .then(json => renderStatus(json))
    }

    function renderStatus(json) {
        const h2 = document.getElementById("hC2");
        h2.innerHTML = "<u>Course Overview</u>";
        const row = document.createElement("div");
        row.classList.add("row");
        const listing = document.getElementById("sCourses");
        listing.innerHTML = "";
        const progress = document.getElementById("sCoursed");
        progress.innerHTML = "";
        console.log(json.length)
        if (json.length == 0) {
            console.log(json.length);
            const h3 = document.createElement("h3");
            h3.innerHTML = "Sorry, you haven't enroll any courses";
            progress.append(h3);
        } else {
        for (data of json) {
            const h3 = document.createElement("h3");
            // const p = document.createElement("p");
            const p1 = document.createElement("p");
            const btn2 = document.createElement("button");
            const btn3 = document.createElement("button");
            const txt2 = document.createTextNode("Drop Out");
            const txt3 = document.createTextNode("Complete");
            btn2.append(txt2);
            btn3.append(txt3);

            const column = document.createElement("button");
            const content = document.createElement("div");

            let btns2 = document.createAttribute("value");
            btns2.value = data["course_id"];
            btn2.setAttributeNode(btns2);
            let btns3 = document.createAttribute("value");
            btns3.value = data["course_id"];
            btn3.setAttributeNode(btns3);
            btn2.classList.add("D");
            btn3.classList.add("C");

            column.id = data["title"]
            column.classList.add("column");
            content.classList.add("content");

            h3.innerHTML = data["title"];
            if (data['status'] == "P"){
                p1.innerHTML = "Currently Status: On Progress";
            }
            if (data['status'] == "D"){
                p1.innerHTML = "Currently Status: Drop Out";
            }
            if (data['status'] == "C"){
                p1.innerHTML = "Currently Status: Complete";
            }
            
            content.append(h3, p1);
            column.append(content,btn2, btn3);
            row.append(column);
            progress.append(row);
        
            // Learning Progress Student
            btn2.addEventListener("click", function(e){
                e.preventDefault();
                let std_token = getCookie("std_token") 
                let courseid2 = this.getAttribute("value");
                let status2 = this.getAttribute("class");
                const url2 = `http://127.0.0.1:5000/elearning/courses/users/drop?std_token${std_token}&course_id=${courseid2}&status=${status2}`
                fetch(url2, {method: "PUT"})
                .then(response => response.json())
                .then(result => {
                    p1.innerHTML = "Currently Status: Drop Out";
                    console.log(result);
                })
            })
                btn3.addEventListener("click", function(e){
                    e.preventDefault();
                    let std_token = getCookie("std_token")
                    let courseid3 = this.getAttribute("value");
                    let status3 = this.getAttribute("class");
                    const url3 = `http://127.0.0.1:5000/elearning/courses/users/drop?std_token${std_token}&course_id=${courseid3}&status=${status3}`
                    fetch(url3, {method: "PUT"})
                    .then(response => response.json())
                    .then(result => {
                        p1.innerHTML = "Currently Status: Complete" 
                        console.log(result);
                    })
                })
            }
        }
    }
            //     column.addEventListener("click", function(e){
            //         e.preventDefault;
            //         let courseid = this.getAttribute("id");
            //         const url = new URL(`${window.origin}/course/title/${courseid}`);
            //         // url.searchParams.set("id",`${courseid}`);
            //         window.location = url
            //     })
            // }

                        //------ student_setting.html ------//


    // function settings(obj) {
    //     let url = obj.getAttribute("href");
    //     if (url.indexOf("?") != 1) obj.setAttribute("href", url + window.location.search);

        // Settings Students
        if (`${window.origin}/student-index/setting`){
            function saveStd(){

                let firstname = document.getElementById("firstname").value;
                let lastname = document.getElementById("lastname").value;
                let username = document.getElementById("username").value;
                let email = document.getElementById("email").value;
                let password = parseInt(document.getElementById("password").value);

                const infos = {firstname, lastname, username, email, password};
                let std_token = getCookie("std_token")
                fetch ('http://127.0.0.1:5000/elearning/user/edit/student?std_token' + std_token, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify(infos)
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    if (response == "Please input password 6 digits numeric and Each field must be fill") {
                        // window.location = `${window.origin}/student-index/setting`
                        alert(response)
                    } else {
                    console.log(response);
                    window.location = `${window.origin}/student-index`;
                    alert("Thank You, Student Information has been updated");
                }
            })
                .catch((error) => console.error('Error:', error))
        } 
    }
        if (`${window.origin}/instructor-index/setting`){
            function saveInst(){

                let firstname = document.getElementById("firstname").value;
                let lastname = document.getElementById("lastname").value;
                let username = document.getElementById("username").value;
                let email = document.getElementById("email").value;
                let password = parseInt(document.getElementById("password").value);
                
                const infos = {firstname, lastname, username, email, password};
                
                let inst_token = getCookie("inst_token")
                fetch ('http://127.0.0.1:5000/elearning/user/edit/instructor?inst_token' + inst_token, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify(infos)
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    if (response == "Please input password 6 digits numeric and Each field must be fill") {
                        // window.location = `${window.origin}/instructor-index/setting`
                        alert(response)
                    } else {
                    console.log(response);
                    window.location = `${window.origin}/instructor-index`;
                    alert("Thank You, Instructor Information has been updated");
                }
            })
                .catch((error) => console.error('Error:', error))
        }
    }

    // Log out
    function logOutStd(){
        let confirms = confirm("Are you sure?");
        if (confirms == true) {
        const url = `http://127.0.0.1:5000/elearning/user/logout/student?q${getCookie("std_token")}`
        fetch(url, {method: "DELETE"})
        .then(response => response.json())
        .then(json => {
            removeCookies();
            alert(json);
            window.location = `${window.origin}/index`;
        })
    } else {
        window.location = `${window.origin}/student-index`;
    }
}


function removeCookies() {
    var res = document.cookie;
    var multiple = res.split(";");
    for(var i = 0; i < multiple.length; i++) {
       var key = multiple[i].split("=");
       document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
 }


    // Log out
    function logOutInst(){
        let confirms = confirm("Are you sure?");
        if (confirms == true) {
        const url = `http://127.0.0.1:5000/elearning/user/logout/instructor?q${getCookie("inst_token")}`
        fetch(url, {method: "DELETE"})
        .then(response => response.json())
        .then(json => {
            removeCookies();
            alert(json);
            window.location = `${window.origin}/index`;
        })
    } else {
        window.location = `${window.origin}/instructor-index`;
    }
}

    function goHistory (){
        window.history.back()
    }
        // Instructor's Course
        function instructorCourses(){
            let inst_token = getCookie("inst_token"); 
            const url = `http://127.0.0.1:5000/elearning/courses/byinstructor?inst_token${inst_token}`
            fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.length == 0) {
                    const h2 = document.getElementById("hC2");
                    h2.innerHTML = "Sorry, you haven't any courses yet";
                } 
                else {
                const h2 = document.getElementById("hC2");
                h2.innerHTML = " ";
                const instructorCourses = document.getElementById("sCourses");
                instructorCourses.innerHTML = "";
                const row = document.createElement("div");
                row.classList.add("row");
                const bck = document.createElement("button");
                const txt1 = document.createTextNode("Back");
                bck.append(txt1);
                bck.classList.add("back");
                bck.setAttribute("onclick", "goHistory()");
                for (data of json) {
                    h2.innerHTML = "Instructor List Courses";
                    const table = document.createElement("table");
                    const column = document.createElement("div");
                    column.classList.add("contents");
                    const tr1 = document.createElement("tr");
                    const tr2 = document.createElement("tr");
                    const tr4 = document.createElement("tr");
                    const tr5 = document.createElement("tr");
                    const tr6 = document.createElement("tr");
                    
                    const img = document.createElement("td");
                    img.setAttribute("rowspan", "5");
                    img.innerHTML = `<img src=${data["img_src"]} alt=${data["title"]} title=${data["title"]}>`;
                    const courseTitle = document.createElement("td");
                    courseTitle.innerHTML =`<b>${data.title}</b>`;
                    const courseDesc = document.createElement("td");
                    courseDesc.innerHTML = "Description : " + data.description;
                    courseDesc.classList.add("description");
                    const courseCount = document.createElement("td");
                    courseCount.innerHTML = "Number of student(s) : " + " " + data.count + " student(s)";
                
                    const btn = document.createElement("button");
                    const txt = document.createTextNode("edit");
                    
                    btn.id = data["course_id"];
                    btn.setAttribute("name", `${data.title}`)
                    btn.append(txt);
                    tr1.append(img, courseTitle);
                    tr2.append(courseDesc);
                    tr4.append(courseCount);
    
                    let course_id = btn.getAttribute("id")
                    const url1 = `http://127.0.0.1:5000/elearning/prerequisite?course_id=${course_id}`
                    fetch(url1)
                    .then(response => response.json())
                    .then(result => {
                        const coursePrerequisite = document.createElement("td");
                        coursePrerequisite.innerHTML = "Prerequisite(s): "
                        tr5.append(coursePrerequisite);
                        for (i= 0; i < result.length; i++) {
                            pre = result[i]["title"];
                            if (pre != null) {
                                const Pre = document.createElement("div");
                                Pre.classList.add("prerequisites");
                                Pre.innerHTML = pre;
                                tr6.append(Pre);
                            }else {
                                const Pre = document.createElement("div");
                                Pre.classList.add("prerequisites");
                                Pre.innerHTML = "-";
                                tr6.append(Pre);
                            }
                        }
                    })    
    
                    table.append(tr1,tr2,tr4,tr5,tr6);
                    column.append(table, btn);
                    row.append(column);
                    instructorCourses.append(row, bck);
    
                    btn.addEventListener("click", function(e){
                        let cid = this.getAttribute("id");
                        let names = this.getAttribute("name")
                        const url = new URL(`${window.origin}/course-update`);
                        url.searchParams.set("id",`${cid}`);
                        url.searchParams.set("title",`${names}`);
                        window.location = url
                    })
                }
            }
        })
    }

        function courselist(){
            const url = 'http://127.0.0.1:5000/elearning/courses';
            fetch(url)
            .then(response => response.json())
            .then(json => {
                let listCourse = document.getElementById("listcourse");
                for (item of json){
                    const title = document.createElement("li");
                    title.setAttribute("name", item['title']);
                    title.innerHTML = item['title'];
                    listCourse.append(title);
                    title.addEventListener("click", function(e) {
                        e.preventDefault();
                        this.classList.toggle("highlight");
                    })
                }
            })
        }


        function create() {
            let inst_token = getCookie("inst_token");
            let len = document.getElementsByTagName("li");
            let description = document.getElementById("description").value;
            let title = document.getElementById("title").value;
            const course = {description, title}
            const url = `http://127.0.0.1:5000/elearning/courses/new?inst_token${inst_token}`
            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Accept":"application/json"},
                body: JSON.stringify(course)})
            .then(response => response.json())
            .then(result => {
                for (k of result){
                    let course_id = k["course_id"];
                    let str = [];
                    for (i=0; i < len.length; i++) {
                        if(len[i].classList.contains("highlight")) {
                            j = len[i].getAttribute("name");
                            str.push(j)
                        }
                    }
                    if (str.length != 0){
                        let pre = str;
                        const titles = {pre};
                        const url1 = `http://127.0.0.1:5000/elearning/courses-prerequisite/new?course_id=${course_id}`
                        fetch(url1, {
                            method: "POST",
                            headers: {"Content-Type": "application/json", "Accept":"application/json"},
                            body: JSON.stringify(titles)})
                        .then(response => response.json())
                        .then(final => {
                            alert("Thank, you!")
                            window.location = `${window.origin}/course-setting`;
                        })
                    } 
                    else {
                        let pre = ""
                        const titles = {pre};
                        const url1 = `http://127.0.0.1:5000/elearning/courses-prerequisite/new?course_id=${course_id}`
                        fetch(url1, {
                            method: "POST",
                            headers: {"Content-Type": "application/json", "Accept":"application/json"},
                            body: JSON.stringify(titles)})
                        .then(response => response.json())
                        .then(final => {
                            alert("Thank, you!");
                            window.location = `${window.origin}/course-setting`;
                        })
                    }
                }
            })   
        }
        
        function edit () {
            let cid = window.location.search;
            let courseId = new URLSearchParams(cid); 
            let course_id = courseId.get("id");
            let inst_token = getCookie("inst_token");
            let len = document.getElementsByTagName("li");
            let description = document.getElementById("description").value;
            let title = document.getElementById("title").value;
            const url = `http://127.0.0.1:5000/elearning/courses/edit?inst_token${inst_token}&course_id=${course_id}`
            fetch(url, {
                method: "PUT",
                headers: {"Content-Type": "application/json", "Accept":"application/json"},
                body: JSON.stringify({title, description})
            })
            .then(response => response.json())
            .then(response => {
                    let str = [];
                    for (i=0; i < len.length; i++) {
                        if(len[i].classList.contains("highlight")) {
                            j = len[i].getAttribute("name");
                            str.push(j)
                        }
                    }
                    if (str.length != 0){
                        let pre = str;
                        const titles = {pre};
                        const url1 = `http://127.0.0.1:5000/elearning/courses-prerequisite/edit?course_id=${course_id}`
                        fetch(url1, {
                            method: "POST",
                            headers: {"Content-Type": "application/json", "Accept":"application/json"},
                            body: JSON.stringify(titles)})
                        .then(response => response.json())
                        .then(final => {
                            alert("Thank, you!")
                            window.location = `${window.origin}/course-setting`;
                        })
                    } 
                    else {
                        let pre = ""
                        const titles = {pre};
                        const url1 = `http://127.0.0.1:5000/elearning/courses-prerequisite/edit?course_id=${course_id}`
                        fetch(url1, {
                            method: "POST",
                            headers: {"Content-Type": "application/json", "Accept":"application/json"},
                            body: JSON.stringify(titles)})
                        .then(response => response.json())
                        .then(final => {
                            alert("Thank, you!");
                            window.location = `${window.origin}/course-setting`;
                        })
                    }
            })
        }

        if (`${window.origin}/course` || `${window.origin}/index/search`) {
        function navigate() {
            let std_token = `${document.cookie.search("std_token")}`
            let inst_token = `${document.cookie.search("inst_token")}`
            if ( std_token == 0 ||  inst_token == 0) {
                let navbarr = document.createElement("div");
                navbarr.classList.add("navbar");
                navbarr.innerHTML =`<a id="acourse" onclick="validate()">Courses</a>`
                let nav = document.getElementById("nav");
                nav.append(navbarr);
            }
            else {
                let navbarr = document.createElement("div");
                navbarr.classList.add("navbar");
                navbarr.innerHTML =`<a id="acourse" onclick="validate()">Courses</a>
                                    <a href ="/sign-in">Sign In</a>
                                    <div class = "dropdown">
                                        <button class = "dropbtn">Register</button>
                                        <div class = "dropdown-content">
                                            <a href="/register-student">Student</a>
                                            <a href="/register-instructor">Instructor</a>
                                        </div>
                                    </div>`
                let nav = document.getElementById("nav");
                nav.append(navbarr);
            }
        }
    }

    if (`${window.origin}/course` || `${window.origin}/index/search`) {
        function validate() {
            let inst = `${document.cookie.search("inst_token")}`
            let std = `${document.cookie.search("std_token")}`
            if (std == 0) {
                window.location = `${window.origin}/student-index`;
            }
            else if (inst == 0) {
                window.location = `${window.origin}/instructor-index`;
            } else {
                window.location = `${window.origin}/index`;
            }
        }
    }