import requests
from bs4 import BeautifulSoup
import json

def extraer_licitaciones(url):
    """
    Extrae las licitaciones de la página basándose en la estructura HTML analizada.
    """
    if url == "PON_LA_URL_AQUI":
        print("Error: Necesitas poner la URL real en la variable URL_OBJETIVO.")
        return []

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"Descargando datos de: {url}")
    try:
        respuesta = requests.get(url, headers=headers)
        respuesta.raise_for_status() # Lanza error si la página no carga
    except Exception as e:
        print(f"Error al descargar la página: {e}")
        return []

    # Usamos html.parser (viene incluido en Python) ya que lxml no se instaló
    soup = BeautifulSoup(respuesta.text, 'html.parser')
    
    # 1. Encontrar la sección exacta de la tabla usando el aria-labelledby que descubriste
    seccion_tabla = soup.find('section', {'aria-labelledby': 'table-heading'})
    if not seccion_tabla:
        print("Error: No se encontró la sección 'table-heading'. Es posible que la página cargue los datos con JavaScript.")
        return []

    # 2. Buscar todas las filas (tr) dentro de esta sección
    filas = seccion_tabla.find_all('tr')
    
    licitaciones = []
    
    # 3. Extraer el texto de cada celda (td) basándonos en tu imagen
    for fila in filas:
        celdas = fila.find_all('td')
        
        # Nos aseguramos de que la fila tenga al menos 4 celdas para evitar filas de cabecera o vacías
        if len(celdas) >= 4:
            try:
                # Asignamos los datos según el orden de tu captura de pantalla
                cuce = celdas[0].text.strip()         # Ejemplo: '26-0291-00-1672588-1-1'
                objeto = celdas[1].text.strip()       # El texto que estaba en la celda colapsada
                tipo = celdas[2].text.strip()         # Ejemplo: 'Consultoria'
                fecha = celdas[3].text.strip()        # Ejemplo: '27/07/2026'
                
                # La 5ta celda podría tener un enlace (etiqueta <a>), intentamos extraerlo
                enlace = ""
                if len(celdas) >= 5:
                    enlace_tag = celdas[4].find('a')
                    if enlace_tag and 'href' in enlace_tag.attrs:
                        enlace = enlace_tag['href']
                
                # Guardamos la información en un diccionario (formato JSON)
                licitacion = {
                    "cuce": cuce,
                    "objeto": objeto,
                    "tipo": tipo,
                    "fecha": fecha,
                    "enlace": enlace
                }
                licitaciones.append(licitacion)
                
            except Exception as e:
                print(f"Error procesando una fila específica: {e}")
                continue

    return licitaciones

if __name__ == "__main__":
    # --- ¡ATENCIÓN! REEMPLAZA ESTO CON LA URL REAL ---
    URL_OBJETIVO = "https://www.sicoesmonitor.com/licitaciones"
    # ------------------------------------------------
    
    datos = extraer_licitaciones(URL_OBJETIVO)
    
    if datos:
        print(f"\nExito: Se extrajeron {len(datos)} licitaciones exitosamente.")
        
        # Mostramos en consola las primeras 2 licitaciones para ver si quedó bien
        print("\nMuestra de los datos extraídos:")
        print(json.dumps(datos[:2], indent=4, ensure_ascii=False))
        
        # Guardamos TODO en un archivo JSON. Este es TU ENTREGABLE para el equipo.
        with open('licitaciones_sicoes.json', 'w', encoding='utf-8') as f:
            json.dump(datos, f, indent=4, ensure_ascii=False)
        print("\nArchivo 'licitaciones_sicoes.json' guardado correctamente.")
    else:
        print("\nError: No se extrajo ningún dato. Verifica la URL o si la página necesita Playwright (JavaScript).")
