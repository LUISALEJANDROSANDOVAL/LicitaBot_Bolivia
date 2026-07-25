# 💼 Modelo de Negocio, Costos y Marco Legal (SaaS B2B)

Este documento es tu **"Escudo y Espada" para el Pitch**. Aquí encontrarás los argumentos de negocio para demostrar que LicitaBot es rentable y los argumentos legales para demostrar que el proyecto es completamente lícito y viable en Bolivia.

---

## 📈 1. Modelo de Negocio (SaaS B2B)

LicitaBot opera bajo un modelo **B2B (Business-to-Business) SaaS (Software as a Service)**. No le vendemos a personas individuales, le vendemos a empresas (PyMEs, Constructoras, Consultoras, Importadoras) cuyo retorno de inversión (ROI) es altísimo. 

*Argumento para el jurado:* "Si a una constructora le cobramos 300 Bs al mes, y gracias a LicitaBot ganan una sola licitación de 1 Millón de Bolivianos en todo el año, el software se pagó solo por los próximos 200 años."

### 1.1. Estructura de Suscripciones (Pricing)

| Plan | Precio (Mensual) | Público Objetivo | Características |
|------|-----------------|------------------|-----------------|
| **Starter (Freemium)** | **0 Bs.** | Autónomos / Consultores | 1 Rubro, 1 Palabra Clave. Alerta por Email (Resumen al final del día). |
| **PyME (Pro)** | **150 Bs.** | Pequeñas y Medianas | Hasta 3 Rubros, 10 Palabras Clave. **Alertas en tiempo real por Telegram** (Zavu). |
| **Corporativo** | **500 Bs.** | Constructoras / Mayoristas | Rubros ilimitados. Múltiples usuarios. **Alertas críticas por SMS** (Zavu). Reportes de competencia. |

---

## 💰 2. Costos Operativos (Unit Economics)

Para demostrar que el negocio es rentable, debemos entender cuánto nos cuesta cada usuario que paga 150 Bs.

### Costo de "Materia Prima" por Alerta:
1. **Scraping SICOES:** Gratis (solo costo del servidor mensual, ej. $20 USD en Render).
2. **Cerebro (OpenAI/Gemini):** Evaluar 1 licitación con `gpt-4o-mini` o `gemini-1.5-flash` cuesta aproximadamente **$0.0001 USD** (menos de 1 centavo de boliviano).
3. **Notificación (Zavu):** 
   - Un mensaje de Telegram es casi gratuito (o centavos de dólar dependiendo del plan).
   - Un SMS cuesta aproximadamente **$0.02 USD** (~0.14 Bs).

### Rentabilidad (Margen Bruto)
Si un cliente "PyME" recibe 30 alertas al mes:
- Costo IA: 30 * $0.0001 = $0.003
- Costo Zavu (Telegram): ~$0.05
- **Costo Total directo por cliente:** Menos de 1 Boliviano.
- **Precio cobrado:** 150 Bolivianos.
- **Margen de ganancia:** > 95% (Típico de los mejores productos SaaS).

---

## ⚖️ 3. Marco Legal (Defensa para el Pitch)

Es muy común que los jueces pregunten: *¿Es legal "scrapear" o sacar datos del SICOES automáticamente? ¿Están hackeando al Estado?*

Tu respuesta debe ser rotunda y respaldada por las siguientes normativas bolivianas:

### 3.1. Principio de Publicidad y Transparencia
- **Decreto Supremo N° 0181 (Normas Básicas del Sistema de Administración de Bienes y Servicios - NB-SABS):** Establece que todas las contrataciones estatales **tienen carácter público**. El SICOES fue creado exactamente para dar transparencia. No estamos accediendo a información confidencial, estamos leyendo el "periódico público" del Estado.
- **Ley de Transparencia y Acceso a la Información Pública (Ley N° 974):** Garantiza a cualquier ciudadano o empresa el derecho a acceder a información del Estado. 

### 3.2. ¿Qué hacemos técnicamente a nivel legal?
**LicitaBot NO hackea, LicitaBot lee.**
- No evadimos sistemas de seguridad (no nos saltamos contraseñas).
- No alteramos ni modificamos la base de datos del SICOES (solo lectura).
- No causamos "Denegación de Servicio" (DDoS), ya que el scraper se configura para leer a intervalos amables (ej. cada 30 minutos), imitando el comportamiento de un humano, pero más rápido.

*Argumento de oro para cerrar:* 
> *"Señores del jurado, LicitaBot no es una herramienta para vulnerar al Estado, es una herramienta cívica y tecnológica que **democratiza** el acceso a las contrataciones públicas. Ayudamos a que las PyMEs bolivianas tengan las mismas oportunidades de enterarse a tiempo que las grandes corporaciones con equipos de 10 personas refrescando la página todo el día."*

---

## 🎯 4. Estrategia de Go-to-Market (Cómo conseguir los primeros clientes)

- **Ventas Directas (Outbound):** Contactar a las empresas inscritas en Fundempresa (SEPREC) y en el Registro Único de Proveedores del Estado (RUPE) que hayan perdido licitaciones recientemente.
- **Prueba Piloto (Free Trial):** Ofrecer 15 días gratis usando Zavu/Telegram. Una vez que la empresa reciba su primera alerta "Jugosa" de un contrato de 1 Millón de Bs en su celular, no querrán dejar de pagar la suscripción de 150 Bs.
