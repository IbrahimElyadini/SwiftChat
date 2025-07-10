input_file = 'chat_stats.log'
output_file = 'chat_stats_cleaned.log'

with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
    for line in infile:
        if ',' in line:
            first_comma_index = line.find(',')
            # Remplacer seulement la première virgule dans le timestamp (celle des millisecondes)
            if first_comma_index > 19:
                outfile.write(line)
            else:
                line = line.replace(',', '.', 1)
                outfile.write(line)
        else:
            outfile.write(line)
