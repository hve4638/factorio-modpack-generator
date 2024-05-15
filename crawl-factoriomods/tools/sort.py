from queue import PriorityQueue

# criteria 리스트의 순서를 기준으로 target의 요소 정렬
# comparsion에 존재하는 요소만 정렬되며 그렇지 않은 요소는 자리를 유지한다
def sort_by_list(source:list, criteria:list)->list:
    dest = source[:]
    q = PriorityQueue()
    for i, item in enumerate(dest):
        if item['mod'] in criteria:
            priority = criteria.index(item['mod'])
            q.put((priority, item))
            dest[i] = None

    for i, item in enumerate(dest):
        if item is None:
            dest[i] = q.get()[1]
    return dest
