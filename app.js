const box=document.querySelector(".box")
const api="https://66b99bb1fa763ff550f8d5f2.mockapi.io/back/todolist"
const editDealog=document.querySelector(".editDealog")
const editForm=document.querySelector(".editForm")
const add=document.querySelector(".add")
const search=document.querySelector(".search")
const sort=document.querySelector(".sort")
const infodialog=document.querySelector(".infodialog")
const nameinfo=document.querySelector(".name")
const idinfo=document.querySelector(".idinfo")
const statusinfo=document.querySelector(".statusinfo")
const bntc=document.querySelector(".bntc")
bntc.onclick=()=>{
    infodialog.close()
}

let idx=null
let status=false

search.oninput=(event)=>{
    Get(event.target.value)
    console.log(event.target.value);
}

add.onclick=()=>{
    let addobj={
        name:search.value,
        status:false
    }
    addTaks(addobj)
    search.value=""
}
sort.onclick = async () => {
    try {
      const response = await fetch(api);
      let data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name));
      getData(data);
    } catch (error) {
      console.error(error);
    }
  };
  
async function addTaks (obj){
try {
    const response = await fetch(api,{
        method:"POST",
        headers:{
            Accept:"application/json",
           "Content-Type":"application/json"
       },
       body:JSON.stringify(obj)
    })
    Get()
} catch (error) {
    alert("not internet")
}
}
async function Get (world){ 
    try {
        const response=await fetch(world?api+"?name="+world:api)
        const data=await response.json()
        getData(data)
    } 
    catch (error) {
       console.error(error); 
    }
}

async function Delete(id){
    try {
        const response=await fetch(`${api}/${id}`,{method:"DELETE"}) 
        Get()
    } catch (error) {
        
    }
}
editForm.onsubmit=(v)=>{
v.preventDefault();
let obj={
    name:editForm["EditName"].value
}
put(obj)
editDealog.close()
}
async function put(obj){
    try {
        const response=await fetch (`${api}/${idx}`,{
            method:"PUT",
            headers:{
                 Accept:"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        Get()
    } catch (error) {
        console.error(error);
    }
}
async function  chek(e){
    let obj={
        name:e.name,
        status:!e.status
    }
    try {
        const response=await fetch (`${api}/${e.id}`,{
            method:"PUT",
            headers:{
                 Accept:"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        Get()
    } catch (error) {
        console.error(error);
    }
}
function getData (data){
  
    box.innerHTML=""
    data.forEach((e,i) => {
         const tr=document.createElement("tr")
         const name=document.createElement("td")
         const id=document.createElement("td")
         const status=document.createElement("td")
         const btnDelete=document.createElement("button")
         const btnEdite=document.createElement("button")
         const btncap=document.createElement("button")
         const info=document.createElement("button")

         const actions=document.createElement("td")
         name.innerHTML=e.name
         id.innerHTML=i+1
         status.innerHTML=e.status?"active":"Anactive"
        //  e.status=!e.status
         btnDelete.innerHTML="delte"
         btnDelete.onclick=()=>{
            Delete(e.id)
            console.log(e.id);
         }
         

         btnEdite.innerHTML="EDIT"
         btnEdite.onclick=()=>{
            editDealog.showModal()
            editForm["EditName"].value=e.name
            idx=e.id
         }
         btncap.innerHTML="CAP"
         btncap.onclick=()=>{
            chek(e)
         }
         info.onclick=()=>{
            infodialog.showModal()
            nameinfo.innerHTML=`Name: ${ e.name}`
            idinfo.innerHTML=`id: ${i+1}`
            statusinfo.innerHTML=`status: ${ e.status}`
         }
         actions.append(btnDelete,btnEdite,btncap,info)
         tr.append(id,name,status,actions)
         box.appendChild(tr)
    });
}
Get()



const btndublick = document.createElement('button');
btndublick.innerHTML = "Delete Duplicates";
btndublick.onclick = ()=>{
    deletedublick();
} 
document.querySelector('.main').appendChild(btndublick);

async function deletedublick() {
    try {
        const response = await fetch(api);
        let data = await response.json();

        const uniqueTasks = {};
        const duplicateIds = [];

        data.forEach(e => {
            if (uniqueTasks[e.name]) {
                duplicateIds.push(e.id);
            } else {
                uniqueTasks[e.name] = e.id;
            }
        });

        for (const id of duplicateIds) {
            await fetch(`${api}/${id}`, { method: "DELETE" });
        }

        Get();
    } catch (error) {
        console.error(error);
    }
}

Get();
