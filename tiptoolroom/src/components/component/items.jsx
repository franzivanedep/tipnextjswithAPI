import React, { useEffect, useState, useMemo, useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PaginationPrevious, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationContent, Pagination } from "@/components/ui/pagination";
import Tdropdown from "./Tdropdown";
import { useToolboxContext } from "./ToolboxContextProvider"; // Import the hook
import App from "./app";
export function Items() {
 const [itemsData, setItemsData] = useState([]);
 const [loadedImages, setLoadedImages] = useState(new Set());
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedCategory, setSelectedCategory] = useState("");
 const [toolboxItems, setToolboxItems] = useState([]);
 const [itemData, setItemData] = useState(null); // New state variable
 const toolboxContext = useToolboxContext(); // Use the hook

 const PageSize = 4;
 const addItemToToolbox = async (item) => {
  try {
      const s_id = localStorage.getItem('S_ID'); // Retrieve the s_id from local storage
 
      await fetch('http://localhost:6969/toolbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ i_id: item.i_id, itemName: item.name, s_id: s_id, images: item.images }), // Add the s_id to the request body
      });
  
      toolboxContext?.addItemToToolbox(item);
      console.log(`Added ${item.i_id} ${item.name} to toolbox.`);
  } catch (error) {
      console.error("Error adding item to toolbox: ", error);
  }
 }
 
 
  useEffect(() => {
    fetch(`http://localhost:6969/items`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setItemsData(data);
        console.log(data);
      })
      .catch(error => {
        console.error("Error fetching items data: ", error);
      });
 }, []);

 const currentItemsData = useMemo(() => {
    let filteredItems = itemsData;
    if (selectedCategory) {
      filteredItems = itemsData.filter(item => item.ct_id === selectedCategory);
    }
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredItems.slice(firstPageIndex, lastPageIndex);
 }, [currentPage, itemsData, selectedCategory]);

 const handleImageLoad = index => {
    setLoadedImages(prevState => new Set(prevState).add(index));
 };

 const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
 };

 const handleNextClick = () => {
    if (currentPage < Math.ceil(itemsData.length / PageSize)) {
      setCurrentPage(currentPage + 1);
    }
 };

 return (
    <>
      <Tdropdown setSelectedCategory={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {currentItemsData.map((item, index) => (
          <div key={index} className="border rounded-lg p-10">
            <img src={item.images} style={{height: 200, width: 200, left:150}} onLoad={() => handleImageLoad(index)} alt="" />
            {!loadedImages.has(index) && <Skeleton className="h-48 w-full" />}
            <div className="mt-4 h-6">
            <h3 className="text-lg font-semibold text-center">
    {item && item.name ? item.name : 'Item Name Not Available'}
  </h3>
  Available: {item && item.quantity !== undefined ? item.quantity : 'Quantity Not Available'}
              <Skeleton />
            </div>
            <div className="mt-2 h-4">
              <Skeleton />
            </div>
            <div className="mt-4">
              <Button className="w-full" variant="outline" onClick={() => addItemToToolbox(item)}>
                Add to Toolbox
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={itemsData.length}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={handlePreviousClick} />
            </PaginationItem>
            {/* ...existing code... */}
            <PaginationItem>
              <PaginationNext href="#" onClick={handleNextClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
 );
}
