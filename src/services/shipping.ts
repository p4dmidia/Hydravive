import { supabase } from '../lib/supabase';

export interface ShippingOption {
  id: number;
  name: string;
  price: number;
  custom_price: number;
  discount: number;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
}

export const calculateShipping = async (toZip: string, items: any[]): Promise<ShippingOption[]> => {
  const fromZip = '74810130'; // CEP de Origem fornecido pelo usuário

  // Preparar os produtos para o Melhor Envio
  const products = items.map(item => ({
    id: item.id.toString(),
    width: item.width || 15,
    height: item.height || 15,
    length: item.length || 15,
    weight: item.weight || 0.5,
    insurance_value: item.price,
    quantity: item.quantity
  }));

  const payload = {
    from: { postal_code: fromZip },
    to: { postal_code: toZip.replace(/\D/g, '') },
    products
  };

  try {
    console.log('--- INICIANDO CÁLCULO DE FRETE ---');
    console.log('Payload:', payload);

    const { data, error } = await supabase.functions.invoke('super-frete', {
      body: {
        action: 'calculate',
        payload
      }
    });

    if (error) {
      console.error('Erro retornado pela Function:', error);
      throw error;
    }
    
    console.log('Resposta do Frete:', data);
    return (data as ShippingOption[]).filter(option => !option.error);
  } catch (err: any) {
    console.error('--- FALHA CRÍTICA NO FRETE ---');
    console.error('Detalhes do Erro:', err);
    throw err;
  }
};
