import{a as s,b as y,c as v}from"./chunk-G4CPWP5O.js";import{a as e}from"./chunk-BYRZ2NRM.js";import"./chunk-JP5XG2OT.js";import"./chunk-LDV6YPMG.js";function M(){let[r,d]=s([]),[p,g]=s(""),[a,m]=s(!1),[n,x]=s("demo"),u=v(null);y(()=>{u.current?.scrollIntoView({behavior:"smooth"})},[r]);let b=()=>{switch(n){case"gemini":return"/api/llm-gemini";case"demo":default:return"/api/llm"}},h=async t=>{if(t.preventDefault(),!p.trim())return;let f={id:Date.now().toString(),role:"user",content:p,timestamp:Date.now()};d(o=>[...o,f]),g(""),m(!0);try{let o=await fetch(b(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:f.content,history:r.map(l=>({role:l.role,content:l.content}))})});if(!o.ok)throw new Error(`Error: ${o.status}`);let i=await o.json();if(i.error)throw new Error(i.error);let c={id:(Date.now()+1).toString(),role:"assistant",content:i.response,timestamp:Date.now()};d(l=>[...l,c])}catch(o){console.error("Error getting LLM response:",o);let i={id:(Date.now()+1).toString(),role:"assistant",content:`Error: ${o.message||"Something went wrong. Please try again."}`,timestamp:Date.now()};d(c=>[...c,i])}finally{m(!1)}},w=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return e("div",{class:"flex flex-col h-[600px]",children:[e("div",{class:"bg-gray-100 p-4 rounded-t-lg mb-2 flex justify-between items-center",children:[e("div",{children:[e("label",{class:"mr-2 text-sm font-medium text-gray-700",children:"LLM Provider:"}),e("select",{value:n,onChange:t=>{x(t.target.value)},class:"p-1 text-sm border rounded bg-white",children:[e("option",{value:"demo",children:"Demo (Sample Responses)"}),e("option",{value:"gemini",children:"Google Gemini"})]})]}),e("span",{class:"text-xs text-gray-500",children:n==="demo"?"Using demo responses":`Using ${n==="openai"?"OpenAI":"Google Gemini"} API`})]}),e("div",{class:"flex-1 overflow-y-auto mb-4 p-4",children:[r.length===0?e("div",{class:"text-center text-gray-500 mt-8",children:[e("p",{children:"Send a message to start a conversation!"}),n!=="demo"&&e("p",{class:"text-xs mt-2",children:["Make sure you have set your ",n==="openai"?"OPENAI_API_KEY":"GEMINI_API_KEY","environment variable."]})]}):r.map(t=>e("div",{class:`mb-4 ${t.role==="user"?"text-right":"text-left"}`,children:e("div",{class:`inline-block rounded-lg px-4 py-2 max-w-[80%] ${t.role==="user"?"bg-indigo-600 text-white":"bg-gray-200 text-gray-800"}`,children:[e("p",{class:"whitespace-pre-wrap",children:t.content}),e("span",{class:`text-xs block mt-1 ${t.role==="user"?"text-indigo-200":"text-gray-500"}`,children:w(t.timestamp)})]})},t.id)),a&&e("div",{class:"text-left mb-4",children:e("div",{class:"inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800",children:e("div",{class:"flex items-center",children:e("div",{class:"dot-typing"})})})}),e("div",{ref:u})]}),e("form",{onSubmit:h,class:"flex items-center border-t p-4",children:[e("input",{type:"text",value:p,onInput:t=>g(t.target.value),placeholder:"Type your message here...",class:"flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500",disabled:a}),e("button",{type:"submit",class:`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md ${a?"opacity-50 cursor-not-allowed":""}`,disabled:a,children:"Send"})]}),e("style",{children:`
          .dot-typing {
            position: relative;
            left: -9px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            animation: dot-typing 1s infinite linear;
          }

          .dot-typing::before,
          .dot-typing::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
          }

          .dot-typing::before {
            left: -15px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.25s;
          }

          .dot-typing::after {
            left: 15px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #9880ff;
            color: #9880ff;
            animation: dot-typing 1s infinite linear;
            animation-delay: 0.5s;
          }

          @keyframes dot-typing {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.6;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `})]})}export{M as default};
