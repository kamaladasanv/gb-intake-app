import('./supabase.js').then(async ({supabase}) => { const { data } = await supabase.from('profiles').select('*'); require('fs').writeFileSync('profiles_out.json', JSON.stringify(data, null, 2)); });
