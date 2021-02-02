  export function objectHasProps(obj, props) {
           let isPropsIn = true;
             props.forEach((p)=>{
                if(!(p in obj) ){
                    isPropsIn = false;
                }
             });
             return isPropsIn;
        }