import('./supabase.js').then(async ({supabase}) => {
  const { data } = await supabase.from('profiles').select('*');
  console.log(data[0].role);
});
