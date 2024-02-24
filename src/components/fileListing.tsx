import {useEffect, useState} from 'react'
import axios, {AxiosResponse} from 'axios'
import { BsFillFolderFill } from 'react-icons/bs'


function FileListing() {

  const [listing, setListing] = useState<webListings>({})
  const [path, setPath] = useState<webItem[]>([{name: '/', type: "folder"}])

  const getListing = () => {
    var test: webListings
  }

  useEffect(() => {
    // Code to run when component is shown (mounted) or when specific dependencies change
    // Make sure to include all dependencies that affect the state in the dependency array
    console.log('Component is shown (mounted) or dependency changed');

    // Example of updating state
    request();

    // Cleanup function (optional)
    return () => {
      // Code to run when component is unmounted
      console.log('Component is hidden (unmounted)');
    };
  }, [/* dependencies */]); // Include all dependencies that affect the state here

  const requestWithPath = (pathList: webItem[]) => {
    const combined: string = pathList.map(item => item.name).join('/');
    console.log(combined);
    request(combined);
  }

  const request = (path: string = '/') => {
    axios.get<webListings>('http://localhost:3000' + path, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response: AxiosResponse<webListings>) => {
      console.log(response.data);
      setListing(response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }

  const fileSelected = (item: webItem) => {
    var lastItem: webItem = path[path.length - 1];

    if (lastItem.type === "file") {
      path.pop();
    }

    setPath((previousPath) => [...previousPath, item]);
  }

  const folderSelected = (item: webItem) => {
    var lastItem: webItem = path[path.length - 1];

    if (lastItem.type === "file") {
      path.pop();
    }

    var newList: webItem[] = [...path, item]
    setPath(newList);
    requestWithPath(newList);
  }

  const pathSelected = (index: number) => {
    // if (index ===0) {
    //   setPath([{name: '/', type: "folder"}])
    // }
    var newList: webItem[] = path.slice(0, index + 1);

    setPath(newList);
    requestWithPath(newList);
  }

  return (

    <dialog id="my_modal_1" className="modal">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Hello!</h3>
      <div className='text-sm breadcrumbs cursor-pointer select-none'>
        <ul>
          {path.map((item, index) => (
            <li onDoubleClick={()=>pathSelected(index)} key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
      <ul className='select-none'>
      {listing.folders?.map((folder) => (
        <li className='cursor-pointer text-left flex items-center' onDoubleClick={() => folderSelected(folder)} key={folder.name}>
          <BsFillFolderFill className="mr-2" /> {/* Icon */}
          {folder.name} {/* List item text */}
        </li>  
      ))}
    </ul>
      <ul className='select-none'>
      {listing.files?.map((file) => (
        <li className='cursor-pointer text-left' onDoubleClick={()=>fileSelected(file)} key={file.name}>{file.name}</li>  
      ))}
      </ul>
      <div className="modal-action">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  )
}

export default FileListing