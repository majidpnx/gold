export async function fetcher<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(input, init);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }
    
    // Handle the new API response structure
    if (data.success === false) {
      throw new Error(data.message || 'خطا در دریافت اطلاعات');
    }
    
    // Return data.data if it exists, otherwise return the whole response
    return data.data ?? data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('خطا در دریافت اطلاعات');
  }
}
