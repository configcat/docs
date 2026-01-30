// In order to be able to generate translations for the project, we have to assign each sidebar item an unique key. 
// This helper function assigns the id to the key property recursively.
// It is used in the ./sidebars.ts and api/sidebars.ts

export function assignKeyToItems(item) {
  try {
    if (item.hasOwnProperty("id")){
      item.key = item.id;
    }
    if (item.hasOwnProperty("items")) {
      item.items.forEach(element => assignKeyToItems(element));
    }    
    return item;  
  } catch (error) {
    console.log(error);
  }
}
