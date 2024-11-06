export const fetchAllPages = async (fetchFunc, perPage, rest) => {
  let page = 0;
  let data = [];
  let response = await fetchFunc({ page, perPage, ...rest });
  data = [...data, ...response.data];
  while (response.data.length === perPage) {
    page++;
    response = await fetchFunc({ page, perPage });
    data = [...data, ...response.data];
  }
  return data
}