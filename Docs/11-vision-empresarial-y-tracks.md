# 💼 Visión Empresarial (B2B SaaS) y Cumplimiento de Tracks

Este documento expone la visión de producto de **LicitaBot** más allá de un proyecto de Hackathon, proyectándolo como una solución corporativa real (SaaS B2B). Además, detalla exactamente cómo la arquitectura del sistema garantiza el cumplimiento y dominio absoluto de los tracks seleccionados.

---

## 🏢 1. La Visión Empresarial: De Hackathon a B2B SaaS

LicitaBot no es solo un script que lee una página web; está concebido como una **plataforma de inteligencia comercial para contrataciones estatales**.

### El Problema (Pain Point) Real en Bolivia
Actualmente, las PyMEs, constructoras y consultoras en Bolivia pierden cientos de miles de bolivianos en oportunidades de negocio porque:
1. El portal del SICOES es ineficiente y difícil de monitorear diariamente.
2. Contratar a un analista junior ("licitador") solo para refrescar la página web todos los días es costoso (aprox. 3000 Bs/mes).
3. Los tiempos de postulación (ANPE) suelen ser muy cortos (4 a 8 días), por lo que enterarse tarde significa perder el contrato.

### La Solución (Nuestra Propuesta de Valor)
LicitaBot reemplaza al "analista junior" con un **Agente de IA Autónomo** que trabaja 24/7 por una fracción del costo.
- **Modelo de Negocio (Monetización):** Suscripción mensual B2B (Ej: 300 Bs/mes por perfil de empresa).
- **Escalabilidad Corporativa:** Una misma cuenta (Ej: una gran constructora) puede tener múltiples "Agentes" monitoreando diferentes rubros (uno para Obras Civiles, otro para Consultoría Ambiental).
- **ROI Inmediato:** Ganar una sola licitación pequeña de 50.000 Bs gracias a una alerta temprana paga años del servicio de LicitaBot.

---

## 🤖 2. Cómo ganamos el "Bolivia Agents Track"

El track exige "productos con agentes que funcionen de verdad". No buscan un chatbot donde el usuario tenga que escribir *prompts* (como ChatGPT normal). Buscan autonomía.

**¿Por qué LicitaBot domina este track?**
Porque implementamos el verdadero paradigma de un Agente (Percepción → Razonamiento → Acción).

1. **Percepción (No Chat):** El agente no espera a que el usuario le hable. Es proactivo. Percibe el entorno recibiendo los datos "crudos" del Scraper del SICOES automáticamente cada hora.
2. **Razonamiento Cognitivo:** El LLM no resume por resumir. Aplica reglas de negocio. Compara el DBC (Documento Base de Contratación) contra el perfil semántico de la empresa.
   - *Ejemplo de Razonamiento:* "La empresa vende computadoras. Esta licitación es de material de escritorio, pero incluye 5 impresoras. Aunque el título no dice computadoras, hay match comercial."
3. **Uso de Herramientas (Function Calling):** El aspecto más avanzado. El LLM decide por sí mismo **cuándo** invocar código externo. Si el match es > 80%, el LLM dispara la función `notify_client()`.

**El WOW Effect para los Jueces:** Demostrar que el usuario (la PyME) puede estar durmiendo o en una obra, y el Agente hace todo el trabajo de análisis y filtrado en background.

---

## 📲 3. Cómo ganamos el "Desafío Zavu"

Zavu es la pieza que cierra el círculo y le da el toque "Mágico" al producto. De nada sirve tener la mejor IA si el usuario tiene que entrar a una página web para ver los resultados (la gente olvida entrar a los dashboards).

**Integración Estratégica de Zavu:**
1. **La "Última Milla":** Zavu es el canal de entrega de nuestra IA. LicitaBot usa la API de Zavu para enviar la información directamente al bolsillo del gerente o vendedor.
2. **Multicanalidad Corporativa:**
   - **Telegram:** Para recibir el resumen ejecutivo completo formateado con viñetas, presupuesto y enlaces directos (ideal para el gerente de ventas).
   - **SMS:** Como alerta de máxima prioridad ("URGENTE: Licitación de 2 Millones en Santa Cruz. Revisa Telegram").
3. **Fricción Cero:** El cliente final de LicitaBot no necesita instalar una nueva app, no necesita aprender a usar nuestro dashboard. Solo configura su perfil una vez y empieza a recibir mensajes de Zavu en su WhatsApp/Telegram habitual.

**El WOW Effect para los Jueces de Zavu:**
Durante la presentación (Pitch), simularemos la publicación de una licitación. El jurado verá los logs del Agente "pensando", e instantáneamente, **el teléfono del presentador sonará con un mensaje real de Telegram entregado por Zavu**. Es la demostración perfecta del valor de su API como puente entre el software complejo y el usuario final.
