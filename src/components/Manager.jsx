import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({site:"", username:"", password:""})
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
      let req = await fetch("http://localhost:3000/")
      let passwords = await req.json()
      console.log(passwords)
      setPasswordArray(passwords)
    }
    

    useEffect(() => {
      getPasswords()  
    }, [])
    

    const showPassword = () => {
      passwordRef.current.type = "text"
      if(ref.current.src.includes("icons/eyecross.png")){
        ref.current.src = "icons/eye.png"
        passwordRef.current.type = "password"
      }
      else{
        ref.current.src = "icons/eyecross.png"
        passwordRef.current.type = "text"
      }
    }

    const savePassword = async () => {
      if(form.site.length > 3 && form.username.length > 3 && form.password.length > 3){

        // If any such id exists in the db, delete it
        await fetch("http://localhost:3000/", { method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id: form.id}) })

      setPasswordArray([...passwordArray, {...form, id: uuidv4()}]) 
      await fetch("http://localhost:3000/", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...form, id: uuidv4()}) })
      // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form, id: uuidv4()}]))
      // console.log([...passwordArray, form])
      setform({site:"", username:"", password:""})
      toast('Password saved!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
    }
    else{
      toast('Error: Password not saved!')
    }
    }

    const deletePassword = async (id) => {
      console.log("Deleting password with id ", id)
      let c = confirm("Do you really want to delete this password?")
      if(c){
        setPasswordArray(passwordArray.filter(item => item.id !== id)) 
        let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id}) })
        // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
        toast('Password Deleted!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
      });
      }
    }

    const editPassword = (id) => {
      console.log("Editing password with id ", id)
      setform({...passwordArray.filter(item => item.id === id)[0], id: id}) 
      setPasswordArray(passwordArray.filter(item => item.id !== id))
      
    }

    const handleChange = (e) => {
      setform({...form, [e.target.name]: e.target.value})
    }

    const copyText = (text) => {
      toast('Copied to clipboard!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
      navigator.clipboard.writeText(text)
    }
    
    
    
  return (
    <>

    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />

    <div className="absolute inset-0 -z-10 h-full w-full
    bg-green-100 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

    <div className="p-2 md:p-0 md:mycontainer min-h-[83.3vh]">
        <h1 className="text-4xl font-bold text-center">
            <span className='text-green-500'>&lt;</span>
            Pass<span className='text-green-500'>MAN/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">Store Your Passwords In your Own Password Manager</p>
        <div className="text-black flex flex-col p-4 gap-8 items-center">
            <input value={form.site} onChange={handleChange} placeholder="Enter Website URL" className="rounded-full border border-green-500 w-full p-4 py-1" type="text" name="site" id="site" />
            <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                <input value={form.username} onChange={handleChange} placeholder="Enter Username" className="rounded-full border border-green-500 w-full p-4 py-1" type="text" name="username" id="username" />
                <div className="relative">
                    <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder="Enter Password" className="rounded-full border border-green-500 w-full p-4 py-1" type="password" name="password" id="password" />
                    <span className="absolute right-[3px] top-[4px] cursor-pointer"
                    onClick={showPassword}>
                        <img ref={ref} className="p-1" width={26} src="icons/eye.png" alt="eye" />
                    </span>
                </div>
                
            </div>
                
            <button onClick={savePassword} className="flex gap-2 justify-center items-center bg-green-500 hover:bg-green-300 cursor-pointer rounded-full px-8 py-2 w-fit border-2 border-green-900">
                <lord-icon
                    src="https://cdn.lordicon.com/efxgwrkc.json"
                    trigger="hover">
                </lord-icon>
                Save
                </button>
        </div>
        <div className="passwords">
            <h2 className="text-2xl font-bold py-4">Your Passwords</h2>
            {passwordArray.length === 0 && <div>No passwords to show</div>}
            {passwordArray.length !== 0 &&  <table className="table-auto w-full rounded-md overflow-hidden mb-3">
                <thead className="bg-green-800 text-white">
                    <tr>
                        <th className="py-2">Site</th>
                        <th className="py-2">Username</th>
                        <th className="py-2">Password</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-green-100">
                    {passwordArray.map((item, index)=>{
                        return <tr key={index}>
                        <td className="py-2 border border-white text-center">
                          <div className="flex justify-center items-center">
                            <a href={item.site} target='_blank'>{item.site}</a>
                            <div className="lordiconcopy cursor-pointer size-7" onClick={()=>{copyText(item.site)}}>
                              <lord-icon
                                style={{"width":"25px", "height":"25px", "paddingTop":"3px", "paddingLeft":"3px"}}
                                src="https://cdn.lordicon.com/xuoapdes.json"
                                trigger="hover">
                              </lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border border-white text-center">
                          <div className="flex justify-center items-center">
                            <span>{item.username}</span>
                            <div className="lordiconcopy cursor-pointer size-7" onClick={()=>{copyText(item.username)}}>
                              <lord-icon
                                style={{"width":"25px", "height":"25px", "paddingTop":"3px", "paddingLeft":"3px"}}
                                src="https://cdn.lordicon.com/xuoapdes.json"
                                trigger="hover">
                              </lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border border-white text-center">
                          <div className="flex justify-center items-center">
                            <span>{item.password}</span>
                            <div className="lordiconcopy cursor-pointer size-7" onClick={()=>{copyText(item.password)}}>
                              <lord-icon
                                style={{"width":"25px", "height":"25px", "paddingTop":"3px", "paddingLeft":"3px"}}
                                src="https://cdn.lordicon.com/xuoapdes.json"
                                trigger="hover">
                              </lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="justify-center py-2 border border-white text-center">
                          <span className="cursor-pointer mx-1" onClick={()=>{editPassword(item.id)}}>
                            <lord-icon
                              src="https://cdn.lordicon.com/ntjwyxgv.json"
                              trigger="hover"
                              style={{"width":"25px", "height":"25px"}}>
                            </lord-icon>
                          </span>
                          <span className="cursor-pointer mx-1" onClick={()=>{deletePassword(item.id)}}>
                            <lord-icon
                              src="https://cdn.lordicon.com/xyfswyxf.json"
                              trigger="hover"
                              style={{"width":"25px", "height":"25px"}}>
                            </lord-icon>
                          </span>
                        </td>
                    </tr>
                    })}
                    
                </tbody>
            </table> }
        </div>
    </div>


    </>
  );
};

export default Manager;
